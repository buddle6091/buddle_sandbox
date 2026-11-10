---
title: "Code Splitting, 번들링 툴 Webpack 도입하기"
slug: "Code-Splitting-번들링-툴-Webpack-도입하기"
date: "2023-04-15T12:46:39.995Z"
updated: "2026-11-08T23:57:16.380Z"
tags: ["React","bundler","code splitting","typescript","webpack","번들러","번들링","코드 스플릿"]
series: "✨Today I Learn (TIL)"
description: "사실 저번 포스팅을 작성하면서 프로젝트를 보다가 뒤늦게 알았다. "
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/f1b9f800-929a-4c4f-b708-164952f23bc9/image.jpeg"
source: "https://velog.io/@buddle6091/Code-Splitting-번들링-툴-Webpack-도입하기"
velog_id: "b8f59ddd-65a3-4e7d-8cf3-5ca6f3232ba3"
---
## 갑자기 최적화 하다말고 왜 Webpack이냐..!
<br>
사실 저번 포스팅을 작성하면서 프로젝트를 보다가 뒤늦게 알았다. 원래 CRA로 React를 생성하면 Webpack을 번들링 툴로 제공한다고 한다. 
그래서 나는 당연히 내 프로젝트가 빌드 시, webpack을 통하여 코드 스플릿을 하는 줄 알았건만... Package.json에는 없다. parcel도, webpack도...

어쩐지 너무 낮더라 성능이.. 이전 포스트를 봐도 불필요한 코드가 bundle 파일의 41.2%를 차지하고 있었고, 내용도 너무 컸다. 

하지만? 나름 잘되었다고도 생각하는 것이, 이번 기회를 발판으로 Code Splitting 과정을 제대로 경험을 통해 익힐 수 있을 것이다.

# Webpack 도입하기


React 공식 홈피에서는 [코드 분할 부분](https://ko.reactjs.org/docs/code-splitting.html)에 이렇게 써있다.

> Create React App이나 Next.js, Gatsby 혹은 비슷한 툴을 사용한다면 여러분이 설치한 앱에서 Webpack을 같이 설치했을 겁니다. 

원래라면 React 프로젝트와 같이 설치가 되어있어야할 **Webpack** 을 설치부터 - 적용 - 코드 분할로 인하여 최적화까지 진행해보겠다.

## 설치

`npm install --save-dev webpack webpack-cli` 명령어를 사용하여 설치를 해준다.

그런데 여기서 왜 --save-dev 로 개발 환경에서만 설치하는 이유는 번들링 프로그램은 배포 환경에서 작용하는 것이 아니기에, 배포 시 용량을 줄이기 위해 개발 환경에서만 사용한다.

_만약 설치 오류가 나면 명령어 뒤에 --force를 붙여보세요_

```json
  "devDependencies": {
    "@types/react-datepicker": "^4.8.0",
    "@types/react-lottie": "^1.2.6",
    "@types/styled-components": "^5.1.26",
    "webpack": "^5.79.0",
    "webpack-cli": "^5.0.1"
  }
```
<br>

## Webpack 설정

우리가 타입스크립트를 사용할때 `tsconfig.json`으로 설정을 하듯이, Webpack 또한 설정파일을 생성하여 관리해야한다.

이때 만들어야 되는 것이 **webpack.config.js**  요 녀석이다.

이후로부터는 Webpack 공식 홈피를 따라서 설정할 것이다. 이번에 타입스크립트 프로젝트인 만큼 webpack 또한 타입스크립트를 인식할 수 있는 환경을 따로 조성해야줘야한다. 
[Webpack 공식 문서의 Setup](https://webpack.kr/guides/typescript/) 은 정말 깔끔하게 잘 만든 느낌이 든다. 그 느낌을 잘 살려서 필자의 포스트에서도 다루도록 하겠당

### Webpack.config.js

먼저 Webpack 설정 파일을 만들기 전에 해당 프로젝트는 타입스크립트로 만들어진 프로젝트다 보니까 타입스크립트 로더를 설치해야된다.

`npm install --save-dev typescript ts-loader`
이렇게 컴파일러와 로더를 설치한다. (의존성 문제 때문에 설치가 안되면, 알죠? --force)


![](https://velog.velcdn.com/images/buddle6091/post/5c7ce67f-91e3-4e6b-b2e7-2ab2d7c175e9/image.jpg)

해당 이미지는 Webpack이 어떻게 번들링을 하는지 간단하게 보여주는 사진이다.
이것을 왜 보여주냐하면, webpack.config.js 를 설정하는데 좀 더 쉬운 이해를 덧붙여줘 도움이 될것이라고 생각되서이다.

번들러가 프로젝트의 여러 확장자들을 하나로 묶고 서드 파티에 맞추어 스플릿을 하려면 하나의 **Enterence**, 즉 모든 파일들이 교차로 묶이는 js 파일에서부터 시작되어야 한다.

그렇다면 우리가 프로젝트를 만들 때, 다른 JS 파일은 몰라도 이것만큼은 훼손되면 안된다, 모든 초기 설정은 여기서 통한다! 바로 **index.js**이다.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
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

여기서도 entry에 index 파일의 경로를 지정해주어서 웹팩아 이 프로젝트 번들링 해줘~ 라고 친절하게 방향성을 지시해줘야한다. 그리고 앞서 설치했던 `ts-loader`를 통해 모든 타입스크립트 파일 (ts, tsx) 를 로드할 수 있게되며, 번들링이 완료된 파일은 **output** 에 지정되어있는 파일로 나오게 된다.


### ts-loader

일단 이 loader에 대하서 더 자세한 설명이 필요할 것 같아서 추가로 적어본다.
그냥 이렇게 기억하면된다. 
webpack은 **자바스크립트 파일만 변환해준다.** 그러기에 다른 자원들을 로드 시켜주기 위해 사용하는 것이다. 리액트의 JSX 또한 뭐 자바스크립트 기반이지만 그래도 +XML 이기에 loader로 변환을 해줘야한다.

원래 같았으면 `npm install --save-dev babel-loader @babel/preset-env @babel/preset-react` 명령어를 통해 babel로 사용하였겠지만, 만약 babel이 없다면 ts-loader 만으로 좀 더 쉽게, 타입스크립트답게 webpack 기능을 활성화 할 수 있다고 한다.


### Source Maps

webpack이 소스 코드를 번들로 묶을 때, 오류 혹은 경고의 발원지를 파악하기 어려울 수도 있다고한다. 우리가 원인 분석을 하여 빠르게 HotFix로 올리려면 어느 부분에서 오류가 발생한 것인지 정확히 알아야만 하기에 자바스크립트는 추적에 용이한, 컴파일된 코드를 원래 소스로 맵핑해주는 **Source Maps**를 제공한다. 

예를 들면 번들링한 파일들이 하나의 번들러 파일로 묶여도 원인이 발생한 JS 파일을 콕 집어내어 개발자들에게 알려주는 그런 기능을 하는 것이다.

클라이언트 서버에서 실험하다, 브라우저 콘솔에서 오류가 발생할 때 위치를 못 찾을 때가 있다.

_SHIT, 내가 만든 파일이 아닌거 같은데, 처음보는 파일명이야 어디서 찾아야해~🤬_ 
이런 경험이 있을 수도 있을텐데 일단 나는 그랬다 ㅎ.

```terminal
Uncaught ReferenceError: cosnole is not defined
   at HTMLButtonElement.printMe (print.js:2)
```

하지만 Source map을 활용하면 위의 문제가 일어난 파일을 정확히 찝어준다.
바로 이것이 번들러 파일에서 여러 개의 자바스크립트 번들링 요소 중에 에러의 근원지를 찾아준다.

그래서 우리는 webpack 설정에서 source map을 켜주어야만 한다. 아래와 같이.

```js
 const path = require('path');

  module.exports = {
    entry: './src/index.ts',
// 여기가 source map 활용
   devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

## 끝?

일단 공식문서 설정은 여기까지다. 나머진 Lodash 같은 third party library를 엮는 것인데, 아직 리펙토링을 진행하기엔 최적화가 갈 길이 멀어 건들지는 않을 것이다.

그럼 번들링하여 나온 최적화 점수를 기대하면서 다음 포스트로 넘어갈 준비를 하겠다!

역시나 그랬듯이, 틀린 부분은 댓글로 시원한 훈수 바랍니다~


> Reference
https://webpack.kr/guides/typescript/
https://goo-gy.github.io/2021-12-31-webpack-react




