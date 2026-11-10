---
title: "생각보다 어려운 Webpack 번들링 (loader 관련 에러)"
slug: "생각보다-어려운-Webpack-번들링-loader-관련-에러"
date: "2023-04-17T06:25:00.713Z"
updated: "2026-11-09T04:18:34.434Z"
tags: ["CSS","React","bundle","loader","typescript","webpack"]
series: "✨Today I Learn (TIL)"
description: "이전 글의 연장선이다.이전 글이 Webpack 도입에 관하였던 내용이었다면, 이번 글은 기존에 있던 라이브러리 들과의 충돌을 해결하는 내용을 담았다.기본적으로 webpack에서 해야될 세팅을 다 끝냈다고 생각했다. 왜냐면 공식문서가 하라는 기본대로 다 했기에 말이다. "
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/f2b9c6b6-2042-4b7f-b3cc-d7c01e75d32b/image.jpg"
source: "https://velog.io/@buddle6091/생각보다-어려운-Webpack-번들링-loader-관련-에러"
velog_id: "e3312fcd-6293-4cd6-8a47-1d500f21186f"
---
> [이전 글](https://velog.io/@buddle6091/Code-Splitting-%EB%B2%88%EB%93%A4%EB%A7%81-%ED%88%B4-Webpack-%EB%8F%84%EC%9E%85%ED%95%98%EA%B8%B0)의 연장선이다.
이전 글이 Webpack 도입에 관하였던 내용이었다면, 이번 글은 기존에 있던 라이브러리 들과의 충돌을 해결하는 내용을 담았다.

# 방심했ㄷr...★

![](https://velog.velcdn.com/images/buddle6091/post/f2b9c6b6-2042-4b7f-b3cc-d7c01e75d32b/image.jpg)


기본적으로 webpack에서 해야될 세팅을 다 끝냈다고 생각했다. 왜냐면 공식문서가 하라는 기본대로 다 했기에 말이다. Loader는 Babel vs Ts-loader 중 사용하면 된다캐서 후자도 고르고 말야

그러나 약 6시간 동안 `npx webpack` 명령어로 번들링을 테스트할 때마다 생기는 오류를 만나게 되었다.

그것은 바로...

# ERR: Module parse failed

## CSS Loader

자바스크립트 파일 뿐만 아니라 CSS 파일도 loader를 통해 읽혀야 된다는 것을 처음 번들링 시도에 알게 되었다.

물론 필자는 css 파일을 따로 생성하지 않고, 스타일드 컴포넌트로 사용했지만, 외부 라이브러리를 사용한 것이 있기에 해당 라이브러리에 import 된 CSS 파일을 웹팩이 읽어야했다는 것을 간과했던 것이다.

그래서 css 관련 로더를 설치해주었다.

`npm install --save-dev css-loader style-loader --force`

그리고 webpack.config.js에 해당 로더를 연결해주었다.

```js
//const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development", // 배포할 때에는 "production" master 브랜치에만 적용하면 될 듯
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js|tsx)$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/i,
        use: ["style-loader", "css-loader"],
        include: [path.resolve(__dirname, "src/style")],
        // exclude: /node_modules/, //제외함
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    contentBase: "./dist",
    port: 3000,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
 
```

그리고 웹팩 번들링 테스트를 하기 위해 `npx webpack` 명령어를 통해 확인하였다.

결과는 난감했다.

## Error 발생

```terminal
ERROR in ./node_modules/swiper/modules/pagination/pagination.min.css 1:0
Module parse failed: Unexpected token (1:0)

~~

ERROR in ./node_modules/swiper/swiper.min.css 13:0
Module parse failed: Unexpected character '@' (13:0)
```
반응형 캐러셀 슬라이드를 여러 블로그를 참고하여 직접 구현했었는데, 그때에는 폰에서 슬라이드가 안되는 문제가 생겨서 하는 수 없이 **swiper** 라는 라이브러리를 사용하여 구현했었다.

해당 라이브러리에 필요한 css 파일에 문제가 생긴 것 처럼 보였었다.

그래서 나는 원인이 **호환성**이라고 생각했었다.
라이브러리에 설치되어있는 모듈들이 현재 webpack 및 loader 들의 버전과 호환이 안되서 인식을 못한다는 것의 내 가정이다.
또한, 라이브러리를 도입하고 3개월 후에 webpack을 latest버전으로 설치했기에 안맞는 부분이 있을 수 있다는 것 또한 뒷받침해준다.

그렇지만 이 문제를 해결하기에는 크나큰 문제가 있다.
바로 **귀찮음**이다.
다시 버전에 맞는 것으로 바꿔야하고, 원래 짜여져 있던 코드와 달라진 부분이 생겨서 그것과도 호환이 안될 수 있기에 번거러움이 생기게 된다.


## 리버싱하는 과정으로 문제 해결 (허무함 주의)

이 귀찮은 짓을 하기 싫은 나는 다시 한번 에러 내용을 찬찬히 읽기 시작했다.
그리고 터미널에서 이러한 문제가 나타나게된 계기를 설명해주는 문구를 발견하게 되었다.

```terminal
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. 
```

해당 파일을 load하는데 필요한 loader가 읽히지 않는 듯해 보였다.
_'그런데 나는 **webpack.config.js** 에서 **css-loader**와 **style-loader**를 입력해 줬는데..?'_

정말 간단한 문제였다.

```js

{
        test: /\.(css|scss)$/i,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
      },
```

exclude.  그러니까 빼버린 것이다. swiper 라이브러리의 css 파일을 loader의 대상에서 ㅎ

exclude를 완전히 지우고 실행해보니..?

### 해결 ☆
![](https://velog.velcdn.com/images/buddle6091/post/c376f899-4a6a-4b87-9e09-0fa6fde049cb/image.png)

그런데 파일이 생각보다 크고 minimized가 제대로 되지 않은 느낌이 든다. 용량도 이전의 그냥 build 보다는 조금 줄긴 했지만, 아직까지 LightHouse도 적신호를 띄고 있긴하다.

확실한 번들링을 다른 포스트에서 시도해보려고 한다.
끝!
