---
title: "[vue] TypeError Unexpected console statement"
slug: "vue-TypeError-Unexpected-console-statement"
date: "2022-12-24T12:22:14.655Z"
updated: "2026-11-06T19:49:57.551Z"
tags: ["ESLint","Vue 3","trouble shooting","typescript","vue"]
series: "⚽Trouble Shooting"
description: "vuex에서 타입스크립트 마이그레이션 중에 발견된 콘솔로그 관련 에러이다.해당 에러에서는 기본적으로 console이 허용되지 않는다라고 한다. 해당 에러에 대해서는 ESlint 공식 문서에서 볼 수 있다.주석으로 /\\* eslint-disable no-console \\"
thumbnail: null
source: "https://velog.io/@buddle6091/vue-TypeError-Unexpected-console-statement"
velog_id: "823a089e-061f-4d61-b1a0-38d0d8a69fcd"
---
```
❗ error: Unexpected console statement (no-console)
```
vuex에서 타입스크립트 마이그레이션 중에 발견된 콘솔로그 관련 에러이다.
해당 에러에서는 기본적으로 console이 허용되지 않는다라고 한다. 해당 에러에 대해서는 [ESlint 공식 문서](https://eslint.org/docs/latest/rules/no-console.html)에서 볼 수 있다.

## 임시적으로 허용 (주석)
```ts
catch (err) {
        /* eslint-disable no-console */
        console.error("Error", err);
        throw err;
      }
```
주석으로 `/* eslint-disable no-console */` 라는 코드를 설정해주면 사용이 가능
=> 이 방식은 `임시` 이기에 직접 설정을 해주는 편이 좋다

## 정책적으로 허용 (설정값 변경)

```ts
"eslingConfig": {
  // 중략
  "rules": {
    "no-console": "off"
},
```

다음은 설정파일 즉, package.json에서 이것을 제어하는 방법이 있는데 위와 같이 설정해 주면 된다!

> Reference
https://rudalson.tistory.com/entry/Vue%EC%97%90%EC%84%9C-error-Unexpected-console-statement-no-console

