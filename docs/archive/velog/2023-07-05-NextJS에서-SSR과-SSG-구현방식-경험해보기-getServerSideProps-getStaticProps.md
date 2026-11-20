---
title: "NextJS에서 SSR과 SSG 구현방식 경험해보기 (getServerSideProps, getStaticProps)"
slug: "NextJS에서-SSR과-SSG-구현방식-경험해보기-getServerSideProps-getStaticProps"
date: "2023-07-05T09:01:35.848Z"
updated: "2026-11-09T08:06:54.343Z"
tags: ["React","SSR","nextjs","ssg","typescript"]
series: "✨Today I Learn (TIL)"
description: "이전에 NextJS + Typescript + TailwindCss 를 모두 첨 사용하여 3일내에 배우고 3일안에 간단한 클론 프로젝트를 했던 경험이 있다.그래서 이번엔 어차피 도전의 목적이 강한 프로젝트라 CSR말고 SSR 프레임워크를 사용해보자! 라는 의미로 썼는데"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/936befd3-33fc-4c47-81d2-01c51ba6e79a/image.png"
source: "https://velog.io/@buddle6091/NextJS에서-SSR과-SSG-구현방식-경험해보기-getServerSideProps-getStaticProps"
velog_id: "036db25c-f24f-48f1-a728-c4cfd6dce30b"
---
# 서론

이전에 NextJS + Typescript + TailwindCss 를 모두 첨 사용하여 3일내에 배우고 3일안에 간단한 클론 프로젝트를 했던 경험이 있다.

그래서 이번엔 어차피 도전의 목적이 강한 프로젝트라 CSR말고 SSR 프레임워크를 사용해보자! 라는 의미로 썼는데.. 알고보니 NextJS에서 CSR로만 프로젝트를 마무리 지었던, 그런 안타까운 경험이 있었다.

심지어 1달 전까지만 해도 나 SSR 만들어봄~ 이러고 다녔으니 부끄럽기 그지 없다😢.

그 래 서 이번엔 더미 데이터를 활용하여 SSR과 SSG 를 동시에 구축하는 것을 경험해보려고 한당


# NextJS에서 SSR과 SSG 구축

서론에서 말했듯이 NextJS에서 프로젝트를 만들었다고 바로 SSG, SSR이 형성되지 않는다.
바로 NextJS에서 사용할 수 있는 함수, **getServerSideProps**, **getStaticProps**를 사용하는 페이지가 그렇게 될 수 있는 것이다.

Hydrate 되는 과정도 한번 읽어보면 페이지의 형식을 결정하는데 도움이 될 것이라고 본다.
다룬 내용은 [여기](https://velog.io/@buddle6091/NextJS%EC%97%90%EC%84%9C-React-%EB%95%8C%EC%B2%98%EB%9F%BC-%EB%B0%94%EB%A1%9C-styled-components%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A9%B4-%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94-%EC%98%A4%EB%A5%98)에 미약하지만 적어보았으니 조금이라도 도움이 되셨으면 좋겠다.

## getServerSideProps (SSR 구축)

![](https://velog.velcdn.com/images/buddle6091/post/077e96b0-9bf5-4ca2-951f-770d416d21b8/image.png)

유저들이 페이지를 요청할 때마다 서버에서 HTML을 받아와 그들에게 보여주는 SSR.
동적인 데이터를 다루는 페이지들을 목적으로 활용한다.

```tsx
import { useState, useEffect } from "react";
import { GetStaticProps, GetServerSideProps } from "next";
import { useRouter } from "next/router";


/* SSR 개발 방식 실험 
일반적인 비동기는 클라이언트에서 호출이 되는데, 해당 함수를 활용하면 서버측에서 호출이 되기에,
페이지를 띄울때 해당 데이터가 다운받아서 적용된 사이트를 볼 수 있음
*/
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const res = await axios.get(`http://localhost:3001/content/${id}`);
  const data = res.data;

  return { props: { data } };
};

export default function Home({ data }: any) {
  console.log(data);
  const [content, setContent] = useState<InContent[]>([]);
  /* 현재 타겟팅 되는 아이템의 likes를 확인해보자 */
  const [likes, setLikes] = useState(0);

	
  return (
    <div> {data.title} </div>
  )
  
}

```

이렇게 `const getServerSideProps = () => {}` 라는 함수를 생성해서 데이터를 ServerSide에서 처리할 수 있게 된다.

또한 파라미터 값으로 **ctx**라는 값을 받는데, 이는 **Context의 줄인말**로 그냥 Context라고 이해하면 편하다. 그리고 그 Context는 아래와 같은 정보로도 접근이 가능해진다.
이번에는 params값으로 접근하였다.

```terminal
[params] contains the route parameters for pages using dynamic routes. For example, if the page name is [id].js , then params will look like { id: ... }. To learn more, take a look at the Dynamic Routing documentation. You should use this together with getStaticPaths, which we’ll explain later.
[preview] is true if the page is in the preview mode and undefined otherwise. See the Preview Mode documentation.
[previewData] contains the preview data set by setPreviewData. See the Preview Mode documentation.
[locale] contains the active locale (if enabled).
[locales] contains all supported locales (if enabled).
[defaultLocale] contains the configured default locale (if enabled).
```

이렇게 props로 넘겨진 data는 해당 props를 사용하는 컴포넌트, 즉 페이지를 SSR로 반환이 가능해진다.

## getStaticProps

```tsx
import { useState, useEffect } from "react";
import { GetStaticProps, GetServerSideProps } from "next";
import { useRouter } from "next/router";


/* SSR 개발 방식 실험 
일반적인 비동기는 클라이언트에서 호출이 되는데, 해당 함수를 활용하면 서버측에서 호출이 되기에,
페이지를 띄울때 해당 데이터가 다운받아서 적용된 사이트를 볼 수 있음
*/
export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params.id;
  const res = await axios.get(`http://localhost:3001/content/${id}`);
  const data = res.data;

  return { props: { data } };
};

export default function Home({ data }: any) {
  console.log(data);
  const [content, setContent] = useState<InContent[]>([]);
  /* 현재 타겟팅 되는 아이템의 likes를 확인해보자 */
  const [likes, setLikes] = useState(0);

	
  return (
    <div> {data.title} </div>
  )
  
}

> Reference
[NextJS Data Fetching](https://nextjs.org/docs/pages/building-your-application/data-fetching#getstaticprops-static-generation)
[SSG. SSR 정리](https://narup.tistory.com/235)
[SSG, SSR 정리 2](https://velog.io/@longroadhome/FE-SSRServer-Side-Rendering-%EA%B7%B8%EB%A6%AC%EA%B3%A0-SSGStatic-Site-Generation-feat.-NEXT%EB%A5%BC-%EC%A4%91%EC%8B%AC%EC%9C%BC%EB%A1%9C)
