---
title: "📆 22.10.28 - NextJS  + Typescript & 지난 주차 첫 백엔드와의 협업.. 그리고 의외의 난항?"
slug: "next-js-typescript"
date: "2022-10-28T01:41:38.423Z"
updated: "2026-10-31T03:52:35.254Z"
tags: ["TIL","nextjs","typescript","백엔드","협업"]
series: "✨Today I Learn (TIL)"
description: "백엔드와의 첫 협업... 순탄할 줄 알았지만 🚢\n\n일단 지난 주차, 그러니까 즉 항해 6주차때 처음으로 백엔드 분들과 협업을 진행하여 조그만한 미니 프로젝트를 진행 하게 되었다. 다들 열의가 대단하여 갈등 등의 부정적인 모습은 찾아볼 수가 없었고, 오히려 서로를 배려"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/8defb9db-3b55-47f2-9c1d-b2bd2419fa47/image.png"
source: "https://velog.io/@buddle6091/next-js-typescript"
velog_id: "c291ba17-f587-45f6-8662-76429fa9fa1f"
---
## 백엔드와의 첫 협업... 순탄할 줄 알았지만 🚢


일단 지난 주차, 그러니까 즉 항해 6주차때 처음으로 백엔드 분들과 협업을 진행하여 조그만한 미니 프로젝트를 진행 하게 되었다. 다들 열의가 대단하여 갈등 등의 부정적인 모습은 찾아볼 수가 없었고, 오히려 서로를 배려하려고 많이 신경쓰게 된 것 같다.

그런데 배포과정에서 첫 협업이 어긋나는 모습을 볼 수가 있었다. 먼저 프론트엔드 팀은 원래 배포하던 사이트들 (versel, netlify 등)에서 최종 결과물이 들어있는 브랜치를 등록하여 배포를 한 뒤, gitignore.git 파일로 걸러지는 API 주소를 배포 사이트 내에서 환경변수로 따로 지정하여 백엔드 팀에서 제작한 API 주소를 프론트 단에서 사용한 axios instance에 적은 환경변수와 같은 이름으로 같이 넣어주면 정상적으로 배포한 사이트에서 사용할 수 있게된다.

그런데? 막상 사용이 되지 않는 것을 볼 수 있었다. 처음엔 환경변수에 등록된 주소가 " " 에 감싸져 있어서 되지 않는 것인가? 라는 의문으로 시작되어 수도 없이 방법을 찾기를 반복하였다. 
그 과정에서 백엔드 단에서 개발한 서버는 http로 배포 되어 있으며, 프론트 단에서 배포한 사이트는 https로 구동되는 사이트이라, 서로간의 출처가 다르므로 API를 사용할 수 없다는 것을 알 수 있었다. 
우리가 미리 그 사실을 인지하고 더 적극적인 소통을 통해 맞추었다면, 제 시간 내에 배포한 서비스를 사람들에게 보여줄 수 있었을 것이다.

이처럼 여러모로 아쉬운 주차였지만, Masonry Grid를 구현해 볼 수 있어서 내겐 나름 의미있는 주차였다.




# Next.js

## NextJs란?

우리가 기본적으로 많이 사용하는 프론트엔드 프레임워크 (라이브러리지만, 그래도 형식은 거의 프레임워크니까) React에서 운용하던 렌더링 방식은 CSR이다. 여기서 SSR 방식으로 개발을 더 편리하게 해주는 React의 프레임워크로 등장한 것이 `NextJS` 이다. 

＊ 간결하게 NextJS의 장점을 정리해보았다.
    
- 개발 과정에서 파일을 저장을 하면 자동으로 변경점이 프론트 서버에 적용이 되어 새로고침 버튼을 누르지 않아도 확인이 가능하다.
- router 를 깔지 않아도 NextJS 자체에서 요구하는 폴더 및 파일 이름을 활용하면 쉽게 라우팅 구현이 가능하다.
- 위에서 설명한데로 SSR을 지원하기 때문에 SEO 구현에서도 큰 장점을 지니고 있다.
- 타입스크립트 적용을 위하여 webpack이나 babel을 건들일 필요 없이 타입스크립트 요소를 따로 추가만 해준 후, 서버 실행만 한다면 자동적으로 타입스크립트 환경파일인 `tsconfig.ts` `next-end.d.ts` 가 생성이 된다.

### 설치
`npx create-next-app [프로젝트 이름]`

 만약 타입으로 설치하려면
 
 `npx create-next-app --typescript`

### 라우팅 설정

이전에 react에서 한 것 처럼 라우팅하면 되지만 next의 규칙을 따라야 한다.

### 정적 라우팅 (static routing)
`보니까 next는 폴더 구성에서 페이지 컴포넌트를 설정하게 된 경로대로 라우팅이 되는 듯 하다.`
예를 들어 pages/shop/Brand.js라고 폴더 구성이 되있다면, pages라는 페이지를 모아두는 폴더로 부터 라우터 주소는 shop/Brand가 된다.

### 동적 라우팅 (dynamic routing)

- pages/shop/[brands].js  -> /shop/:brands (/shop/nike)

```jsx

// [brands].jsx

import {useRouter} from "next/router"

export default function brands() {
 const router = useRouter();
  
  const {brands} = router.query;
  
  return (
  	<div>
      <h1>shop/{brands}</h1>
    </div>
  )
}

```


- pages/[username]/setting.js -> /:username/setting.js  (/amy/setting)

-> 다이나믹 폴더를 이용하여 하위에 다이나믹 라우터 경로가 들어오더라도 사용할 수 있게


- pages/post/[...all].js -> /post/*(/post/2920/id/title)


동적 라우터와 정적 라우터가 같이 있으면 정적 라우터가 우선으로






