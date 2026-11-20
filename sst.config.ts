/// <reference path="./.sst/platform/config.d.ts" />

/**
 * 배포 — Next(SSR · ISR · Route Handler 포함) → OpenNext → AWS. 결정 배경은 docs/architecture.md §1.7.
 *   CloudFront ─┬─ S3            : _next/static · public · 빌드 시 미리 만든 HTML(○ Static)
 *               ├─ Lambda(서버)  : SSR(ƒ Dynamic) · ISR 재생성 · Route Handler
 *               └─ Lambda(이미지): next/image 최적화
 *   ISR 재검증 = SQS + Lambda, 태그 캐시 = DynamoDB (SST 가 자동으로 만든다)
 *
 * 스테이지
 * - `production` : master 머지 시 GitHub Actions 가 배포. buddle.it.kr. protect + retain.
 * - `pr-<번호>`  : PR 마다 미리보기(*.cloudfront.net). PR 닫히면 Actions 가 지운다.
 * - 그 외(예: `staging`, 개인 이름) : 로컬 실험용. 지우면 리소스도 사라진다.
 *
 * 도메인 연결 순서 (ACM 인증서는 DNS 검증이라 네임서버가 Route 53 을 가리켜야 발급이 끝난다)
 *   1) 로컬에서 `npx sst deploy --stage production` → Route 53 영역 · 메일 레코드 · GitHub 배포 역할 생성
 *   2) 가비아 네임서버를 출력된 NS 4개로 변경 → `dig NS buddle.it.kr +short` 에 awsdns 확인
 *   3) GitHub 저장소 변수 BUDDLE_DOMAIN_READY=1 → 다음 master 배포부터 인증서 · CloudFront 에 도메인 연결
 */
const DOMAIN = 'buddle.it.kr';
const GITHUB_REPO = 'buddle6091/buddle_sandbox';
/** package.json devDependencies 의 @opennextjs/aws 와 맞춘다 — next >=16.4.5 지원(2026-11-20 로컬 빌드 확인) */
const OPEN_NEXT = 'node_modules/.bin/open-next';

export default $config({
  app(input) {
    const production = input?.stage === 'production';
    return {
      name: 'buddle-sandbox',
      removal: production ? 'retain' : 'remove',
      protect: production,
      home: 'aws',
      // 서울 리전. 로컬은 SSO 프로필 `buddle`, CI 는 OIDC 로 받은 임시 자격 증명 — 접근 키를 어디에도 저장하지 않는다
      providers: { aws: { region: 'ap-northeast-2', ...(process.env.CI ? {} : { profile: 'buddle' }) } },
    };
  },
  async run() {
    const production = $app.stage === 'production';
    const attachDomain = production && process.env.BUDDLE_DOMAIN_READY === '1';

    let zoneId: $util.Output<string> | undefined;
    let deployRoleArn: $util.Output<string> | undefined;

    if (production) {
      // ── Route 53 영역 + 가비아에서 옮기는 Google Workspace 레코드 ─────────────────
      // 2026-11-20 dig 로 확인한 값. 네임서버를 넘기기 전에 먼저 있어야 메일 · Google 로그인이 끊기지 않는다.
      const zone = new aws.route53.Zone('Zone', { name: DOMAIN, comment: `${DOMAIN} — SST 관리` });
      zoneId = zone.zoneId;
      new aws.route53.Record('Mx', { zoneId: zone.zoneId, name: DOMAIN, type: 'MX', ttl: 3600, records: ['1 smtp.google.com'] });
      new aws.route53.Record('ApexTxt', {
        zoneId: zone.zoneId,
        name: DOMAIN,
        type: 'TXT',
        ttl: 3600,
        records: ['google-site-verification=ofemXMwtdXvYM_qBAQbsFXEIQhDV10fhC8k4NVjkSOk', 'v=spf1 include:_spf.google.com ~all'],
      });
      new aws.route53.Record('Dkim', {
        zoneId: zone.zoneId,
        name: `google._domainkey.${DOMAIN}`,
        type: 'TXT',
        ttl: 3600,
        records: [
          'v=DKIM1;k=rsa;p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDU/yQyXpFwr3GkKznh50Dwfsia6jFm4bZ0T9n3AcVN06MW0vbhsFu0t22eABNRNs5ruvqru3JCOSGStvmZqzvbr7QTP5CqGmN14EiOJKvBZ6OmOX+whFToQjO/aURvxGFEm9aJIWGNVdhvqKBLKBC5FavcnC74m5j+3hBVhcKRIwIDAQAB',
        ],
      });

      // ── GitHub Actions → AWS (OIDC) ──────────────────────────────────────────────
      // 저장소 비밀값에 접근 키를 넣지 않는다. Actions 가 실행마다 짧게 사는 토큰으로 이 역할을 맡는다.
      // 신뢰 조건: 이 저장소의 master 브랜치 push, 또는 이 저장소 안 브랜치에서 올린 PR(포크 PR 은 워크플로에서 따로 막는다).
      const github = new aws.iam.OpenIdConnectProvider('GithubOidc', {
        url: 'https://token.actions.githubusercontent.com',
        clientIdLists: ['sts.amazonaws.com'],
      });
      const role = new aws.iam.Role('GithubDeployRole', {
        name: 'buddle-sandbox-github-deploy',
        maxSessionDuration: 3600,
        assumeRolePolicy: $jsonStringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { Federated: github.arn },
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringEquals: { 'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com' },
                StringLike: {
                  'token.actions.githubusercontent.com:sub': [`repo:${GITHUB_REPO}:ref:refs/heads/master`, `repo:${GITHUB_REPO}:pull_request`],
                },
              },
            },
          ],
        }),
      });
      // SST 는 CloudFront · Lambda · S3 · IAM · SQS · DynamoDB · Route 53 · ACM 을 만들고 지운다 → 학습 단계는 관리자 권한.
      // 배포가 안정되면 실제 호출된 API(CloudTrail) 기준으로 줄인다 — qa-log [open] 항목.
      new aws.iam.RolePolicyAttachment('GithubDeployAdmin', { role: role.name, policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess' });
      deployRoleArn = role.arn;
    }

    // ── Next 사이트 ───────────────────────────────────────────────────────────────
    const site = new sst.aws.Nextjs('Web', {
      path: 'apps/web',
      // 로컬에 고정 설치한 OpenNext 로 빌드(실행 시 npx 로 매번 내려받지 않는다). 내부에서 `npm run build`(next build)를 부른다
      buildCommand: `../../${OPEN_NEXT} build`,
      ...(attachDomain && zoneId
        ? { domain: { name: DOMAIN, redirects: [`www.${DOMAIN}`], dns: sst.aws.dns({ zone: zoneId }) } }
        : {}),
    });

    return {
      url: site.url,
      ...(production && zoneId && deployRoleArn
        ? {
            nameservers: aws.route53.getZoneOutput({ zoneId }).nameServers,
            githubDeployRoleArn: deployRoleArn,
            domainAttached: String(attachDomain),
          }
        : {}),
    };
  },
});
