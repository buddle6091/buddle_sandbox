---
title: "본격적으로 Webpack Optimize 하기 (Bundle Analyzer, Chunk, Minimize, Uglify)"
slug: "본격적으로-Webpack-Optimize-하기-Bundle-Chunk-Minimize"
date: "2023-04-22T09:10:05.235Z"
updated: "2026-11-03T02:27:50.796Z"
tags: ["React","bundle","chunk","code splitting","minimize","optimize","typescript","uglify","webpack","난독화","번들링","최적화"]
series: "✨Today I Learn (TIL)"
description: "이제 Webpack을 통하여 본격적인 Optimize를 진행해보려고 한다!\n사실 Webpack5가 도입이 되면서 아주 기본적인 최적화를 default로 진행을 해준다고 한다.\n\n하지만, 이외의 Plugin과 Optimaization 옵션을 적절하게 사용하면 번들크기를"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/6034b83d-f821-4815-8605-ecb21a048a27/image.png"
source: "https://velog.io/@buddle6091/본격적으로-Webpack-Optimize-하기-Bundle-Chunk-Minimize"
velog_id: "f658479a-0076-4e2f-bb01-164da8f7b8c8"
---
이제 Webpack을 통하여 본격적인 Optimize를 진행해보려고 한다!
사실 Webpack5가 도입이 되면서 아주 기본적인 최적화를 default로 진행을 해준다고 한다. 

하지만, 이외의 Plugin과 Optimaization 옵션을 적절하게 사용하면 번들크기를 줄이는데 도움이 되고, 번들을 줄이는 매커니즘(?)을 배워가는 과정이 될 것이라 생각하니 쪼매 설렌다.

---

# Webpack Analyzer Plugin

**Webpack Analyzer Plugin**은 Bundle 들의 크기 및 구성이 어떻게 이루어져있는지 시각적으로 보여주는 Plugin이다.

이전에 [최적화 포스트](https://velog.io/@buddle6091/%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0-4.-LightHouse-%EC%A7%84%EB%8B%A8%ED%95%B4%EC%84%9C-%EB%82%98%EC%98%A8-%EB%AC%B8%EC%A0%9C%EC%A0%90-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)에서 **자바스크립트 줄이기**가 Web Vital 수치에 크게 기여한다고 적었었는데, 이 Webpack을 설치한 것 만으로는 번들들을 잘 관리했다고 말할 수 없다고 한다.

그래서 우리는 Webpack의 여러 설정을 통해서 Bundle들을 이 Analyzer를 통하여 확인하고 줄여가보는 과정을 그려가야한다.

## Webpack Analyzer 설치 / 설정

### 설치

```terminal
npm install --save-dev webpack-bundle-analyzer
```

### webpack에 불러오기

```js
// Plugin 변수 생성 (Plugin 불러오기)
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// Plugins 에서 사용하겠다고 명시하기
plugins: [
    new BundleAnalyzerPlugin({
	  analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
      excludeAssets: [/node_modules/]
    }),
			 ...
  ],
```

이와 같은 설정을 한 후 `npx webpack` 명령어로 webpack을 실행해주면 아래와 같은 이미지를 볼 수 있다.

![](https://velog.velcdn.com/images/buddle6091/post/6034b83d-f821-4815-8605-ecb21a048a27/image.png)

여러개의 사각형들이 조각조각 나눠서 보여지는데 사각형의 크기는 곧 용량의 크기를 비례하게 된다. 이것을 보고 불필요한 라이브러리나, 어느 부분을 더 조각내야되는지 추측할 수 있게 된다.

### webpack analyzer options

webpack analyzer plugin도 여러 옵션들을 통해서 보여짐을 달리 할 수 있다.

- **analyzerMode** : 플러그인을 서버에서 열어서 확인할지 (**server**), HTML 보고서를 생성하여 볼지 (**static**), 아니면 잠시 끌지 (**disabled**) 정할 수 있게된다. Default는 Server

- **openAnalyzer** : 이 옵션은 플러그인이 기본 브라우저에서 번들 보고서를 자동으로 열지 여부를 결정하며 **Boolean 값**으로 되어있다. Default는 true

- **generateStatsFile** : Plugin이 번들에 대한 통계를 포함하는 JSON 파일을 생성해야 하는지 여부를 결정한다. 이것도 **Boolean**값이며, Default는 false.

- **statsFilename** : **generateStatsFile** 이 true일 경우, analyze된 JSON 파일 이름. default는 "stats.json"

- **reportFilename** : **analyzerMode**가 static일 경우, HTML 보고서의 이름을 설정하는데, default는 "report.html"


- **logLevel** : 이 옵션은 플러그인의 로그 출력에 대한 세부 수준을 설정한다. "info", "warning", "error" 또는 "silent"으로 설정할 수 있으며, default는 "info"

<br>

# 본격적으로 Webpack Option 만지기

## 비교

### Lazy() 로 Code Spitting 하기 전

처음 Webpack을 실행해서 build를 하였을 때는 아래와 같은 warning이 발생하였다.

```terminal
WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).        
This can impact web performance.
Assets: 
  main.bundle.js (8.43 MiB)

WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance. 
Entrypoints:
  main (8.43 MiB)
      main.bundle.js


WARNING in webpack performance recommendations:     
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.

```

번들 사이즈가 너무 커서 더 나은 퍼포먼스를 구현하기 위해 Lazy load를 통해 어플리케이션을 개선하라는 이야기이다. 하기사 기본으로 로딩되는 main.bundle.js가 (8.43 MB)나 되니 반드시 개선을 해야된다.

그래서 ~ [저번 포스팅](https://velog.io/@buddle6091/Webpack-%EB%B3%B8%EA%B2%A9%EC%A0%81%EC%9D%B8-%EB%B2%88%EB%93%A4%EB%A7%81-Minimize) 에서 **Lazy()** 와 **Suspense** 를 통한 페이지 분할을 통하여 Code Splitting을 진행하였다.



### Webpack Optimization을 안 건들였을 때


```terminal
WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance. 
Entrypoints:
  main (1.26 MiB)
      main.bundle.js


webpack 5.79.0 compiled with 2 warnings in 16031 ms 
```

오! 많이 줄었다..! 이번엔 1.26MB이라고 한다. 그래도 더 나은 퍼포먼스를 위해 더 줄이면 좋을 것 같다. 이때 **Optimization**을 활용해보려고 한다.

아, 참고로 이때의 Bundle Analyzer의 visulize된 이미지는 이러하다.

![](https://velog.velcdn.com/images/buddle6091/post/7ea74027-15df-4871-a209-fd6ce83c7e2c/image.png)


## Webpack Optimization

### optimization.minimize

``` js
optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },

```

플러그인을 사용하여 번들 크기를 최소화해주는 옵션이다. Boolean 값으로 결정되며, Default는 true.


### optimization.minimizer

**minimize**가 true여서 해당 플러그인들을 활용할 수 있을 때 기입하는 스코프이다.
필자는 **Css Minimizer Webpack Plugin**과 **Terser Webpack Plugin**을 사용하였다.

#### css minimizer webpack plugin
webpack5 부터 webpack 측에서 권고하는 CSS를 압축하여 크기를 줄이는 플러그인으로 최적화에 도움이 된다. 설치는 다음과 같다.


설치는 `npm installl --save-dev css-minimizer-webpack-plugin`




#### Terser Webpack Plugin

설치는 `npm installl --save-dev terser-webpack-plugin`



---

너무 많아서 천천히 정리 

Chunk file 이란 코드 스플리팅 시 생성되는 자바스크립트 파일 조각

chunk 간에 겹치는 패키지들을 별도의 파일로 추출해주는 것을 verdor




> Reference
최고다! Chat GPT!
[webpack 공식 홈피](https://webpack.kr/configuration/optimization/)
[웹팩5로 청크 관리 및 코드 스플리팅 하기](https://www.zerocho.com/category/Webpack/post/58ad4c9d1136440018ba44e7)
