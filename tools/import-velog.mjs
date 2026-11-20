/**
 * velog 글 가져오기 — 공개 GraphQL(v2.velog.io/graphql)로 한 사용자의 공개 글 전부를 Markdown 으로 저장한다.
 * 사용: node tools/import-velog.mjs <username> [outDir=content/velog]
 * 결과: <outDir>/<YYYY-MM-DD>-<slug>.md (frontmatter + 원문 body 그대로) · <outDir>/index.json(목록 · 이미지 URL)
 * 본문은 고치지 않는다(이미지 URL 도 velog CDN 그대로). 다시 돌리면 같은 파일을 덮어쓰고, 사라진 글의 파일은 지운다(멱등 — index.json 에 실행 시각을 넣지 않는다).
 * 파일 이름이 겹치면 velog id 앞 8자를 붙인다. 요청은 3회까지 재시도한다.
 * 비공개 글은 로그인 없이는 내려오지 않는다 — 공개 글만 대상.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , username, outDir = 'content/velog'] = process.argv;
if (!username) {
  console.error('usage: node tools/import-velog.mjs <username> [outDir]');
  process.exit(1);
}
const API = 'https://v2.velog.io/graphql';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const gql = async (query, variables) => {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) });
      if (!res.ok) throw new Error(`velog ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(JSON.stringify(json.errors));
      return json.data;
    } catch (e) {
      if (attempt >= 3) throw e;
      await sleep(800 * attempt);
    }
  }
};

const LIST = `query($u:String!,$c:ID){posts(username:$u,cursor:$c,limit:50){id url_slug}}`;
const POST = `query($u:String!,$s:String!){post(username:$u,url_slug:$s){id title url_slug body short_description thumbnail released_at updated_at is_markdown is_private tags series{name url_slug}}}`;

const list = [];
for (let cursor; ; ) {
  const { posts } = await gql(LIST, { u: username, c: cursor });
  if (!posts.length) break;
  for (const p of posts) if (!list.some((x) => x.id === p.id)) list.push(p);
  cursor = posts.at(-1).id;
  if (posts.length < 50) break;
}

/** 파일명에 쓸 수 없는 글자 제거 — 한글은 유지 */
const safe = (s) => s.replace(/[\/\\:*?"<>|\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
const yaml = (v) => JSON.stringify(v ?? null); // JSON 은 유효한 YAML 스칼라/시퀀스
const IMG = /!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)(?=\s|$|[^)])|<img[^>]+src=["']([^"']+)["']/gm;

mkdirSync(outDir, { recursive: true });
const index = [];
const used = new Set();
for (const { url_slug } of list) {
  const { post: p } = await gql(POST, { u: username, s: url_slug });
  if (!p || p.is_private) continue;
  const date = (p.released_at ?? p.updated_at ?? '0000-00-00').slice(0, 10);
  let file = `${date}-${safe(p.url_slug)}.md`;
  // 같은 날 · 앞 80자가 같은 슬러그는 한 파일로 겹친다 → velog id 로 구분
  if (used.has(file.toLowerCase())) file = `${date}-${safe(p.url_slug)}-${p.id.slice(0, 8)}.md`;
  used.add(file.toLowerCase());
  const images = [...p.body.matchAll(IMG)].map((m) => m[1] ?? m[2]);
  const fm = [
    '---',
    `title: ${yaml(p.title)}`,
    `slug: ${yaml(p.url_slug)}`,
    `date: ${yaml(p.released_at)}`,
    `updated: ${yaml(p.updated_at)}`,
    `tags: ${yaml(p.tags)}`,
    `series: ${yaml(p.series?.name)}`,
    `description: ${yaml(p.short_description)}`,
    `thumbnail: ${yaml(p.thumbnail)}`,
    `source: ${yaml(`https://velog.io/@${username}/${p.url_slug}`)}`,
    `velog_id: ${yaml(p.id)}`,
    '---',
    '',
  ].join('\n');
  writeFileSync(join(outDir, file), fm + p.body.replace(/\r\n/g, '\n') + '\n');
  index.push({ file, title: p.title, slug: p.url_slug, date: p.released_at ?? p.updated_at, tags: p.tags, series: p.series?.name ?? null, markdown: p.is_markdown, chars: p.body.length, images });
  await sleep(120); // 예의상 간격
}
index.sort((a, b) => b.date.localeCompare(a.date));
// 더는 없는 글(삭제 · 비공개 전환 · 슬러그 변경)의 파일을 지워 파일 수와 index.count 를 맞춘다
for (const f of readdirSync(outDir)) if (f.endsWith('.md') && !used.has(f.toLowerCase())) rmSync(join(outDir, f));
writeFileSync(join(outDir, 'index.json'), JSON.stringify({ username, count: index.length, posts: index }, null, 2) + '\n');
console.log(`${index.length} posts → ${outDir}`);
