---
title: "NextJS에서 React 때처럼 바로 styled-components를 사용하면 발생하는 오류 (feat. Hydration)"
slug: "NextJS에서-React-때처럼-바로-styled-components를-사용하면-발생하는-오류"
date: "2023-06-07T09:43:39.288Z"
updated: "2026-11-10T04:05:32.036Z"
tags: ["React","SSR","nextjs","styled components","typescript"]
series: "⚽Trouble Shooting"
description: "FOUC Error 발생\n\nNextJS에서 styled-compoent를 사용하려다 발생한 오류이다.\nWarning: Prop className did not match. Server: \"sc-dcrmVg jFNoJa\" Client: \"sc-bgqQcB gBPwub\"\n"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/432da579-20fd-415b-954f-3d897705bae9/image.jpg"
source: "https://velog.io/@buddle6091/NextJS에서-React-때처럼-바로-styled-components를-사용하면-발생하는-오류"
velog_id: "c8b804c6-d547-4643-95b4-88869f9e6475"
---
# FOUC Error 발생

NextJS에서 styled-compoent를 사용하려다 발생한 오류이다.
`Warning: Prop className did not match. Server: "sc-dcrmVg jFNoJa" Client: "sc-bgqQcB gBPwub"`

해당 오류가 발생했는 것을 인지했던 것은 만들었던 UI 요소가 렌더링이 되지 않았었는데, 위의 경고글을 개발자 창을 통해서 확인하게 되었다.


## FOUC란?

FOUC는 Flash Of Unstyled Content의 약자로 **페이지의 스타일시트 정보가 로드 시점에 포함되지 않아서 스타일이 비어있는 페이지가 로드 되는 현상**을 말한다.

그런데 왜? 라는 생각을 한번해보게 되는데, 여기서 **Styled-components와 NextJS의 특징**을 알게 되면 단박에 이해가 된다.

### 왜 이런 현상이 나에게..

먼저 Styled-components는 **css-in-js**의 형태를 띄우는 스타일 라이브러리인데, 말 그대로 JS에 스타일 시트 기능을 부여하는 기능이다. 그리고 NextJS 는 기존 CSR를 주로 운영하던 React에서 **SSR와 SSG**을 부여하는 프레임워크이라는 것을 아는 우리는 슬슬 감이 올 것이다.

#### Hydration

Server Side Rendering는 기존 CSR과 달리 서버에서 먼저 빈 html을 가져와 유저로 하여금 먼저 UI를 경험할 수 있게 해주는 Pre-rendering 을 진행하게 된다.

그러고 그냥 놔두면 정말 Interaction을 선보일 수 조차없는 빈 깡통이라, 서버에서 이에 연동되는, 해당 기능 및 페이지에 필요한 JS 파일을 다운받아 연결하게 되는데, 유저가 UI를 볼 동안 안보이는 면에서 그 기능 들을 다운받아 붙여주는 것을 **Hydration**이라고 한다. 아래 이미지가 이해에 조금 도움을 줄 것 같다!


![](https://velog.velcdn.com/images/buddle6091/post/1b10b160-a6df-40d5-bb21-e5e67b19a17c/image.png)

그렇기에 JS 형태로 존재하는 스타일 시트이기에 hydrate 과정에서 페이지 로드 시 완전한 스타일을 입히기 전에 렌더링이 되어 스타일이 누락된 화면이 보여지는 것이 해당 에러의 발단이다.

# 에러 해결을 위한 여러 시도들

## Bebel Plugin을 이용한 설정 (~ nextJS ver.11)

우선 NextJS에서 styled-components 를 SSR 환경에서 안정적으로 활용하기 위해서는 plugin 설정을 해야되는데, Babel-plugin-styled-components를 설치한 후 다음과 같이 설정을 주었다.

```js
// .babelrc

{
	"plugins" ["babel-plugin-styled-componets"] 
}

```

## Bebel Plugin을 이용한 설정 (nextJS ver.12 ~)

위의 Babel 설정이 반응이 없다는 것을 알게 되었고, Next 버전에 따라서 방법을 다르게 해야된다는 것 또한 알게 되었다.

root 폴더를 보면 **next.config.js** 라는 파일이 있는데 여기서 다음과 styled-components 의 SSR 사용을 설정해주면 된다.

```js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;


```

이렇게하면 원래는 운좋게 스타일들이 입혀져도 리렌더링하면 다시 에러와 함께 스타일이 날라갔던 것을 기존 react에서 했던 것과 같이 활용할 수 있게 된다!


> reference
https://curo.tistory.com/entry/NextJS-%EC%BD%98%EC%86%94-Prop-className-did-not-match-%EC%98%A4%EB%A5%98
https://handhand.tistory.com/291
https://velog.io/@huurray/React-Hydration-%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC



