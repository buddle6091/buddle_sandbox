---
title: "React에서 env를 불러올 시, process가 읽히지 않을 때 (feat. vite)"
slug: "React에서-env를-불러올-시-process가-읽히지-않을-때-feat.-with-vite"
date: "2023-11-29T00:46:57.059Z"
updated: "2026-11-06T04:24:57.469Z"
tags: ["React","env","process","vite","환경변수"]
series: "✨Today I Learn (TIL)"
description: "회사에서 프로젝트를 진행하는데, ReCaptcha를 사용하기 때문에 사이트 키를 받아놓을 환경변수가 필요했다. 그래서 .env 파일에 환경변수를 저장하고 불러보게 되었다.Next가 아닌 React 기반 프로젝트이니까 그동안 했던 것 처럼 똑같이 환경변수에는 REACT_"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/f5740ccb-8c6f-427a-bae7-b0ad9e08804d/image.png"
source: "https://velog.io/@buddle6091/React에서-env를-불러올-시-process가-읽히지-않을-때-feat.-with-vite"
velog_id: "1b20cf55-b8ed-4107-a163-193d919e3481"
---
# 리액트에서 했던 것처럼 환경 변수를 사용해 볼까?

회사에서 프로젝트를 진행하는데, ReCaptcha를 사용하기 때문에 사이트 키를 받아놓을 환경변수가 필요했다. 그래서 .env 파일에 환경변수를 저장하고 불러보게 되었다.

## 그런데..? 'process' is not defined?

Next가 아닌 React 기반 프로젝트이니까 그동안 했던 것 처럼 똑같이 환경변수에는 `REACT_APP_`을, 불러올 때에는 그 앞에 `process.env`를 붙여서 환경변수를 불러오는 절차를 밟았다.

```tsx
const sitekey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  console.log(sitekey);
```

그런데 웬 걸..?

부제목처럼 이런 에러가 발생하게 되었다.

`'process' is not defined`

## env를 읽지 못하는 거 같아.

그래서 서론에 말했다시피 내가 처음부터 만든 프로젝트가 아니기에 REACT 프로젝트가 만들어지는 방법을 겪어 보지 않았기에 env 설정 가능한 부분이 설치가 안되어있는게 아닐까라는 생각을 해보았다.
듣기로는 CRA로 만들어진 프로젝트가 아니라면, env 라이브러리가 없어서 env가 읽히지 않아서 생기는 문제라는 이야기를 듣고, dotenv 를 설치 후 root 컴포넌트에 적용하여 다시 호출하여 보았다.


```js
// main.tsx

import dotenv from "dotenv";

// todo : dotenv 호출
dotenv.config();
```

그래도 결과는 **안됨**이었다..


## vite인 것을 다시 한번 생각해보자

앗차차.. 사실 이 프로젝트는 vite 번들러를 사용한 프로젝트, 고로 환경변수는 vite가 관리한다.

그래서 아래와 같이 사용을 해야된다.

1. .env에서 REACT_APP의 접두사를 VITE로 변경

2. 그리고 불러올 때, process.env에서 import.meta.env.VITE~ 

```ts
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  console.log(sitekey);
```

나처럼 React 앱인데 왜 이전에 잘만 사용했던 환경변수가 안불러져~ 하지 말고 이렇게 자신이 사용하는 번들러가 무엇인지 잘 보고 반영하는 것도 좋은 방법일 것 같다!

(1시간이나 버렸다.. ㅎㅎ 시간을)


> reference
[VITE 공식문서](https://ko.vitejs.dev/guide/env-and-mode.html)
