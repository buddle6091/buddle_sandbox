---
title: "NextJS에서 페이지들에게 옷(레이아웃) 입히기 (Feat. Children Props, NextJS Routing)"
slug: "NextJS에서-페이지들에게-옷레이아웃-입히기-Feat.-Children-Props-NextJS-Routing"
date: "2023-06-05T11:06:05.362Z"
updated: "2026-11-02T02:08:11.310Z"
tags: ["Props","React","Route","children","layout","next.js","typescript"]
series: "✨Today I Learn (TIL)"
description: "인간은 어쩔 수 없이 계속해서 진행되는 망각을 완전히 막을 수 없다고 생각한다. 그런 의미로 오늘은 NextJS를 다시 되짚어보면서 Layout을 입혀보려고 한다."
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/82e2ee55-0045-4715-8ecb-db4fcb1e15ad/image.png"
source: "https://velog.io/@buddle6091/NextJS에서-페이지들에게-옷레이아웃-입히기-Feat.-Children-Props-NextJS-Routing"
velog_id: "4cf70954-2bc4-444d-a42e-3c8d1894e4f7"
---
인간은 어쩔 수 없이 계속해서 진행되는 망각을 완전히 막을 수 없다고 생각한다. 그런 의미로 오늘은 NextJS를 다시 되짚어보면서 Layout을 입혀보려고 한다.

---

# 그동안 React에서는

React에서는 Layout Components를 모든 페이지들의 루트를 관리하는 Router 컴포넌트를 감싸주는 형식으로 처리가 가능하였다.

```jsx
// Router.js

import Layout from ../layout/Layout;

        <Layout>
          <TransitionGroup>
            <CSSTransition timeout={500}>
              <Routes>
                <Route path="/" element={<Home />} />
                               ...
                  <Route path="/mypage/myplan" element={<MyPlan />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
        </Layout>

```
그렇다면 Router 파일을 통하여 모든 페이지를 관리를 하던 React-Router와는 달리 자체적인 프레임워크로 Router파일 대신 파일 및 폴더명으로 라우팅을 지원하는 Next.js는 layout을 어떻게 지정하면 좋을까?

# Next에서 Layout 설정하기

Next에서 React-Router-Dom 라이브러리를 따로 사용하지 않아도 이전에 React에서 했던 것처럼 똑같이 하면 된다. 🥰

필자는 미리 Layout 컴포넌트를 미리 제작을 해놓았다.
Next에서는 Default로 `_app.tsx` 에서 `<Component {...pageProps} />` 라는 컴포넌트로 마치 layout에서 children props로 전체 페이지에 적용시키는 형식으로 이루어져 있다.

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { theme } from "@/styles/Theme";
import { ThemeProvider } from "styled-components";
import Layout from "@/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  if (process.env.NODE_ENV === "production") {
    console.log = function no_console() {};
    console.warn = function no_console() {};
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

결론은 그래서.. 간단하다
`<Component {...pageProps} />` 컴포넌트를 Layout이든 필자처럼 Styled-Components나 React query를 채용하면 부모 스코프로 감싸주면 된다


