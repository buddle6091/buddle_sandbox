---
title: "Webpack 만으로는 code splitting이 안된다. (React Lazy, Suspense)"
slug: "Webpack-본격적인-번들링-Minimize"
date: "2023-04-17T10:24:37.519Z"
updated: "2026-11-08T23:29:11.025Z"
tags: ["React","bundle","minimize","typescript","webpack"]
series: "✨Today I Learn (TIL)"
description: "React Lazy는 React 16버전부터 지원하게 된 API로 구성 요소의 코드 로드를 해당 컴포넌트가 처음 렌더링될 때까지 연기할 수 있는 기능을 가지고 있다. 다시 말해 **Lazy Loading**이다.\n\n또한 Javascript Chunk file로 분리해주"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/de002231-303f-4fc7-ab26-9c03f2a5d545/image.jpg"
source: "https://velog.io/@buddle6091/Webpack-본격적인-번들링-Minimize"
velog_id: "26e343d0-b4af-45ec-9dc8-4f7fcab93e0d"
---
# webpack은 언제 적용이 되나요?

아래는 내가 질문한 [개발자 커뮤니티 (Careerly) 질문](https://careerly.co.kr/qnas/2826?fa=notification)의 해답이다. 물론 질문은 리액트 내장 실행어 `react-scripts start`는 웹팩의 적용을 받나요? 웹팩 변경 사항을 확인하려면 `webpack ~` 관련 명령어를 쳐야하나요? 이다.

![](https://velog.velcdn.com/images/buddle6091/post/fab0e354-cf27-4f7e-a415-5b699eed6217/image.png)

---

# Webpack 이외의 방법으로 Code Splitting

아무튼 Webpack을 도입하여 번들링을 하였지만, 번들사이즈는 여전히 1600대이며, lightHouse 수치는 70을 뚫지를 못하고 있다.

물론 수 많은 webpack 설정을 도입한 것이 아니라서 그렇지만, 사용하지 않는 컴포넌트까지 한번에 부르기에 초기 로딩이 오래걸려서 그런 결과들이 나온다고 생각한다.
왜냐하면 이 프로젝트는 CSR로 만들어진 것이기 때문에 초기에 자바스크립트 파일을 모두 가져오게 된다.

그래서 우리는 **React의 Lazy**를 통하여 사용하지 않는 페이지나 컴포넌트를 Lazy Loading 하여 추가로 Code Splitting 을 구현할 수 있게 된다.

## React Lazy

React Lazy는 React 16버전부터 지원하게 된 API로 구성 요소의 코드 로드를 해당 컴포넌트가 처음 렌더링될 때까지 연기할 수 있는 기능을 가지고 있다. 다시 말해 **Lazy Loading**이다.

또한 Javascript Chunk file로 분리해주는 기능 또한 내장되어있다고 한다. 이 기능을 활용하여 코드를 분할해 볼 예정이다.

### React Lazy 사용하기

React Lazy는 해당 변수에 Lazy 콜백에 load 시키고 싶은 컴포넌트를 불러내는 방식으로 사용한다.

```react
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

React Lazy으로 가져오는 컴포넌트는 다음과 같은 규칙을 지켜야 한다

- React 컴포넌트를 반드시 포함할 것
- default export를 반드시 가져야 할 것



## React Suspense

그리고 React Lazy는 동적으로 불러오기에 그 과정안에 로드되는 컴포넌트를 사이에 표현을 해야한다. 코드를 분할했기에 해당 컴포넌트에 해당되는 자바스크립트를 가져오지 않았으니, 그 렌더링 기간 동안 `Loading` 같은 것을 보여주면 좋을 것이다.

그런걸 React에서는 **Suspense**라는 컴포넌트를 지원한다.

```react
import { Suspense, lazy } from "react";

<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```
방식은 위와 같이 `<Suspense>` 가 감싸고 있는 컴포넌트들이 로드할 때 **fallback** 인 `<Loading />` 컴포넌트가 보여지게 된다. 그리고 로드가 다 완료되면 해당 컴포넌트가 보여지는 구조로 이루어져 있다.



## Lazy와 Suspense의 관계

그러다보니 React Lazy로 불려진 컴포넌트는 항상 Suspense가 감싸고 있다.
그렇다면 이 둘의 결정적인 관계는 무엇일까?

궁금한 부분을 요즘 Hot한 Chat GPT에게 물어보았다.
물론 공짜버젼을 쓰고 있어 영문만 나오기에 번역하여 아래와 같이 정리해 보았다.

---

React 16에 도입된 React.lazy() & React.Suspense 두 가지 기능으로 구성 요소를 지연 로드하고 보다 선언적인 방식으로 로드 상태를 처리할 수 있습니다. 함께 사용하려는 이유는 다음과 같습니다.

향상된 성능: 필요에 따라 구성 요소를 로드하는 데 사용하면 React.lazy() 애플리케이션의 초기 다운로드 크기를 줄이고 성능을 향상시킬 수 있습니다. 사용자에게 즉시 필요하지 않은 구성 요소는 실제로 필요할 때까지 로드되지 않기 때문입니다.

더 나은 사용자 경험: React.Suspense를 사용하여 로드 상태를 처리할 때 구성 요소가 로드되는 동안 로드 표시기 또는 폴백 UI를 표시하여 더 나은 사용자 경험을 제공할 수 있습니다. 이는 부자연스러운 전환을 방지하는 데 도움이 되며 애플리케이션의 응답성을 높여줍니다.

단순화된 코드: React Lazy() 와 함께 사용하면 React.Suspense 코드를 단순화하고 작성해야 하는 상용구의 양을 줄일 수 있습니다. 더 이상 로딩 상태를 수동으로 처리하거나 지연 로딩을 달성하기 위해 타사 라이브러리를 사용할 필요가 없기 때문입니다.

요컨대, React.lazy()과 React.Suspense함께 사용하면 코드를 단순화하면서 애플리케이션의 성능과 사용자 경험을 향상시킬 수 있습니다.

---

# 페이지 분할로 성능 향상 시키기

그렇다면 React Lazy로 어떻게 분할하면 좋을까.
해당 프로젝트는 CSR로 만들어져있기에, 사용하지 않은 페이지까지 처음 로딩시 모두 하나의 번들로 불러오게된다. 그렇다면, 안쓰는 페이지는 따로 Lazy 처리하면 어떻게 될까?

## 분할 전의 Router

```js
// router.js

import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Welcome from "../pages/Welcome";
import Splash from "../pages/Splash";
import KaKaoAuth from "../pages/OAuth/KaKaoAuth";
import GoogleAuth from "../pages/OAuth/GoogleAuth";

import Topic from "../pages/Topic";
import Detail from "../pages/Detail";
import Ddetail from "../pages/DetailPage/Ddetail";
import Dreview from "../pages/DetailPage/Dreview";
import Result from "../pages/Result";
import Keyword from "../pages/Keyword";
import Mypage from "../pages/Mypage";

import NotFound from "../pages/NotFound";
import Layout from "../layout/Layout";
import MyReview from "../pages/Mypage/MyReview";
import MyPick from "../pages/Mypage/MyPick";
import MyPlan from "../pages/Mypage/MyPlan";
import Review from "../pages/Review";

/* Switch가 react-router-dom ver 6 넘어가며 Switch를 지원 안하게 됨 -> Routes */

function Router() {
  return (
    <BrowserRouter>
      <Splash />
      <Layout>
        <TransitionGroup>
          <CSSTransition timeout={500}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="result" element={<Result />} />
              <Route path="keyword" element={<Keyword />} />
              <Route path="topic/:topicId" element={<Topic />} />
              <Route path="login" element={<Login />} />
              <Route path="/kakao/callback" element={<KaKaoAuth />} />
              <Route path="/google/callback" element={<GoogleAuth />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="Welcome" element={<Welcome />} />
              <Route path="/detail/:campId" element={<Detail />}>
                <Route path="/detail/:campId/detail" element={<Ddetail />} />
                <Route path="/detail/:campId/review" element={<Dreview />} />
              </Route>
              <Route path="/review/:campId" element={<Review />} />
              <Route path="mypage" element={<Mypage />} />
              <Route path="/mypage/" element={<Mypage />}>
                <Route path="/mypage/myreview" element={<MyReview />} />
                <Route path="/mypage/mypick" element={<MyPick />} />
                <Route path="/mypage/myplan" element={<MyPlan />} />
              </Route>
              <Route path="/*" element={<NotFound />} />
            </Routes>
```
해당 코드는 React Lazy 도입 전의 라우터 코드이다.
그렇다면 위에서 언급한데로 페이지를 분할해보려면 우짜면 좋을까.

해당 프로젝트는 처음에 `<Splash />` 페이지에서 2초 후에 `<Home />` 가 렌더링 되게 된다.
그래서 필자는 위의 두개의 시작 컴포넌트를 제외하고 나머지 페이지를 분할을 시도해 보았다.


## 분할 후의 Router

```js
// router.js

import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Home from "../pages/Home";
import Splash from "../pages/Splash";
import KaKaoAuth from "../pages/OAuth/KaKaoAuth";
import GoogleAuth from "../pages/OAuth/GoogleAuth";

import Ddetail from "../pages/DetailPage/Ddetail";
import Dreview from "../pages/DetailPage/Dreview";

import Layout from "../layout/Layout";

/* Switch가 react-router-dom ver 6 넘어가며 Switch를 지원 안하게 됨 -> Routes */

function Router() {
  /* Lazy를 활용하여 페이지 분리하기 */

  const Result = lazy(() =>
    /* webpackChunkName: "Result" */ import("../pages/Result")
  );
  const Keyword = lazy(() =>
    /* webpackChunkName: "Keyword" */ import("../pages/Keyword")
  );
  const Topic = lazy(() =>
    /* webpackChunkName: "Topic" */ import("../pages/Topic")
  );
  const Login = lazy(() =>
    /* webpackChunkName: "Login" */ import("../pages/Login")
  );
  const SignUp = lazy(() =>
    /* webpackChunkName: "SignUp" */ import("../pages/SignUp")
  );
  const Welcome = lazy(() =>
    /* webpackChunkName: "Welcome" */ import("../pages/Welcome")
  );

  const Mypage = lazy(() =>
    /* webpackChunkName: "Mypage" */ import("../pages/Mypage")
  );
  const NotFound = lazy(() =>
    /* webpackChunkName: "NotFound" */ import("../pages/NotFound")
  );
  const MyReview = lazy(() =>
    /* webpackChunkName: "MyReview" */ import("../pages/Mypage/MyReview")
  );
  const MyPick = lazy(() =>
    /* webpackChunkName: "MyPick" */ import("../pages/Mypage/MyPick")
  );
  const MyPlan = lazy(() =>
    /* webpackChunkName: "MyPlan" */ import("../pages/Mypage/MyPlan")
  );
  const Detail = lazy(() =>
    /* webpackChunkName: "Detail" */ import("../pages/Detail")
  );
  const Review = lazy(() =>
    /* webpackChunkName: "Review" */ import("../pages/Review")
  );

  return (
    <BrowserRouter>
      <Splash />
      <Suspense fallback={<div>...loading</div>}>
        <Layout>
          <TransitionGroup>
            <CSSTransition timeout={500}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="result" element={<Result />} />
                <Route path="keyword" element={<Keyword />} />
                <Route path="topic/:topicId" element={<Topic />} />
                <Route path="login" element={<Login />} />
                <Route path="/kakao/callback" element={<KaKaoAuth />} />
                <Route path="/google/callback" element={<GoogleAuth />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="Welcome" element={<Welcome />} />
                <Route path="/detail/:campId" element={<Detail />}>
                  <Route path="/detail/:campId/detail" element={<Ddetail />} />
                  <Route path="/detail/:campId/review" element={<Dreview />} />
                </Route>
                <Route path="/review/:campId" element={<Review />} />
                <Route path="mypage" element={<Mypage />} />
                <Route path="/mypage/" element={<Mypage />}>
                  <Route path="/mypage/myreview" element={<MyReview />} />
                  <Route path="/mypage/mypick" element={<MyPick />} />
                  <Route path="/mypage/myplan" element={<MyPlan />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
        </Layout>
```

## 결과

그렇다면 과연 번들이 각 페이지별로 잘 나누어지는걸까?

아래의 이미지는 서비스를 첫 로드했을 때의 네트워크 창의 자바스크립트 파일 로드 현황이다.
![](https://velog.velcdn.com/images/buddle6091/post/80bc7a64-6ccc-4ee8-80f2-412b94ab9f53/image.png)

그리고 아래 이미지는 `<Result />` 페이지의 로드 시의 이미지이다.

![](https://velog.velcdn.com/images/buddle6091/post/e3b71aad-0f7a-411c-940e-b62e2ba8bc42/image.png)

기존에 있던 JS 파일이 2개정도 더 늘어난 것을 확인할 수 있다.
이 파일들은 분할되어서 나온 Chunk 파일이다.

해당 부분은 Webpack 부분에서 다룰 예정이라 더 자세히 들여다 보진 않을 것이지만, 어쨋든 CSR 환경에서 SSR 처럼 필요할 때 한방~ 하지 않았는가.

지금까지 Lazy를 통하여 코드 스플릿하는 과정을 진행하였다.



> Reference
[웹팩5로 청크 관리 및 코드 스플리팅 하기](https://www.zerocho.com/category/Webpack/post/58ad4c9d1136440018ba44e7)
[React Lazy 공식 사이트](https://react.dev/reference/react/lazy)
[성능 최적화 1. 번들 크기 줄이기](https://medium.com/@uk960214/%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-1-%EB%B2%88%EB%93%A4-%ED%81%AC%EA%B8%B0-%EC%A4%84%EC%9D%B4%EA%B8%B0-react-webpack-minify-code-splitting-e2391e7e5f1b)
