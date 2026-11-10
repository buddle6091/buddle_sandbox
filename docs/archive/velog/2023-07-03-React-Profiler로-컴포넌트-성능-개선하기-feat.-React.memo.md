---
title: "React Profiler로 컴포넌트 성능 개선하기 (feat. React.memo)"
slug: "React-Profiler로-컴포넌트-성능-개선하기-feat.-React.memo"
date: "2023-07-03T08:59:33.137Z"
updated: "2026-11-10T09:33:11.320Z"
tags: ["React","React Profiler","React.memo","memoization"]
series: "✨Today I Learn (TIL)"
description: "본 포스트는 패스트캠퍼스의 한 번에 끝내는 프론트엔드 개발 초격차 패키지 online 의 리액트 프로파일러를 통하여 각 컴포넌트를 비교, memoization을 활용한 성능 개선을 하는 부분을 학습 후 정리한 포스트입니다.메모이제이션을 어떻게 활용해야는지 헷갈렸던 차에"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/fd821ac6-0dad-4cf5-bcae-e64efdaaa084/image.jpg"
source: "https://velog.io/@buddle6091/React-Profiler로-컴포넌트-성능-개선하기-feat.-React.memo"
velog_id: "745d1e48-9531-4311-a3ad-c0395dd7330e"
---
> 본 포스트는 패스트캠퍼스의 [한 번에 끝내는 프론트엔드 개발 초격차 패키지 online](https://fastcampus.co.kr/dev_online_frontend) 의 리액트 프로파일러를 통하여 각 컴포넌트를 비교, memoization을 활용한 성능 개선을 하는 부분을 학습 후 정리한 포스트입니다.

메모이제이션을 어떻게 활용해야는지 헷갈렸던 차에 이전에 구매했던 강의에서 React Profiler 관련 강의가 추가가 되어 학습한 내용을 정리해보면서 메모이제이션을 활용한 성능 개선을 경험해보려고 한다.

---

# React Profiler

일단 프로파일러에 대한 기본적인 설명은 [이전에 작성한 포스트](https://velog.io/@buddle6091/%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0-3.-React-Profiler-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0)를 참고해주시면 좋을듯 하다.

그렇다면 이것을 바탕으로 구체적으로 어느 때에 컴포넌트의 성능 개선을 결심하면 좋을까?

## ❗이전과 바뀐 것 같은 프로파일러

위의 포스트에서 사용할 때만 해도 분명히 Dev Server에서 Profiler와 Components 기능을 사용할 수 있었는데...

이번에 사용하니 개발자 탭에 사라져있는 것을 확인할 수 있었다..

![](https://velog.velcdn.com/images/buddle6091/post/ceaaa6dc-f7ec-48b0-a670-fb63f81791d3/image.png)

**Build용 Product를 사용해야지만, 해당 기능을 사용할 수 있다**라고 쓰여있다. 예전엔 딱히 그런거 없었던 거 같은데 말이지

아래는 프로젝트가 배포된 사이트에서 확인해 본 이미지이다. 해당 사이트에서는 Profiler를 사용할 수 있었다.

![](https://velog.velcdn.com/images/buddle6091/post/82d9817b-d881-4372-b40c-f8e445fe349a/image.png)

안그래도 React 공홈에서 `<Profile>` 태그로 둘러 쌓은 다음에 프로파일링 분석이 가능하다는 것으로 보이는데, 한번 시도하여 실제 프로젝트에 테스팅해보고 후기 올리도록 하겠습니당



# 두 컴포넌트의 A / B Test

똑같은 기능을 가진 두 가지의 컴포넌트 파일을 생성하여 비교를 해보면 왜 개선이 필요한지 명확히 알 수 있다. 그래서 대조군을 두어 차이점을 알아보는 A / B Test를 진행하려고 한다. 

`A.jsx` 라는 파일은 각 역할을 하는 요소들을 **하나의 컴포넌트 내**에서, `B.jsx`라는 파일은 **여러 컴포넌트로 나눠서**의 중점으로 생성하고 그 둘을 React Profiler로 비교해보는 시간을 가져보자. 

_패스트캠퍼스의 강의를 모토로 역할이 비슷한 코드를 작성해 보았습니다. 부분부분 빠뜨린 부분은해당 컴포넌트들이 각각 렌더링하는 부분과 아주 큰 관련이 없다고 판단하여 빼보았습니다._


## 예시 코드

### App.jsx

```jsx 
// App.jsx
import { useState } from "react";

const [text, setText] = useState("");

return (
  <div style={{ padding: '1rem' }}>
    <input 
      value={text}
      onchange={e => setText(e.target.value)}
      />
    
    <div style={{ display: 'flex' }}>
      <A text={text}/>
      <B text={text}/>
    </div>
   </div>
);
```


### A.jsx

```jsx
// A.jsx
import React from 'react'

const A = ({text}) => {
 return (
   <div>
     <h1>Components A</h1>
     // Text Components
     <p>{text}</p>
     // List Components
     <ul>
       ~~ list Data
       </ul>
   </div>
 ) 
}

```


### B.jsx

```jsx
// B.jsx
import React from 'react'

// List Components
const List = () => {
~~
}

// Text Components
const B = ({text}) => {
 return (
   <div>
     <h1>Components B</h1>
     <p>{text}</p>
   </div>
 ) 
}

```

## Profiler를 사용해서 비교해보자

이렇게 만들어진 App 을 실행한 후에, DevTool에서 Profiler를 키면 좌측 상단에 녹화버튼이 있는데 해당 툴을 사용하여 전체 컴포넌트은 `App.jsx`내에서 사용된 `A.jsx`, `B.jsx`가 로드되는 시점과 시간들을 체크가 가능하다.

이번에 볼 것은 `App.jsx`에서 input으로 받아온 `text` State 값을 A와 B 컴포넌트 들이 각각 받아들이면서 불필요한 렌더링을 발생시켜 성능이 어떻게 차이가 나는지 봐야된다.

![](https://velog.velcdn.com/images/buddle6091/post/16147179-08f7-42d2-b80e-d6aa1b5525bc/image.png)

결과는 A 컴포넌트가 B 컴포넌트보다 렌더링 시간이 짧은 것을 확인할 수 있다.
그리고 더 충격적인 이미지는 아래와 같다.

![](https://velog.velcdn.com/images/buddle6091/post/eb8aabe1-6e29-45f5-a6a7-12c570b4f9a5/image.png)

onChange값으로 받은 setText값이 변하여 Props에 영향을 주니 당연히 해당 Props를 받은 컴포넌트는 리렌더링할 수 밖에 없는 React의 룰을 잘 따르고 있는 모습을 보여주고 있지만, B 컴포넌트가 유독 여러 컴포넌트가 사각형으로 빛나면서 리렌더링이 되고 있다는 모습을 보여주는 사진이다.

기능별로 컴포넌트를 나눠보니 계속 저렇게 성능이 저하되는 것을 확인했다. 그렇다면, 과연 컴포넌트를 분리하면 성능이 안좋아지니 A처럼 작성해야되느냐.


### Components 구분의 필요성

보통 _Components를 왜 나눠서 개발해요~_ 라고하면, 재사용성, 특징, 협업 등등 많은 이야기들을 내세우곤 한다. 다 맞는 말이라고 생각을 한다.

애초에 React 조차 컴포넌트를 개발을 하여 페이지, 레이아웃 등등 다 그려내도록 유도하기 때문에, 자바스크립트 라이브러리지만, 프레임워크라고도 생각되지 않는가.

개인적으로 재사용성이 많이 두드러지는 특징이라고 생각한다. 또한 해당 기능을 가독성있게 확인하려면 컴포넌트를 나눠서 개발을 진행해야 그 부분을 쉽게 유지보수가 가능하다고 생각되고 그것이 최대의 장점이라고 본다.

# Memoization을 활용해볼까

그러면 우리는 이러한 장점을 살리면서 성능도 살리고 싶다. 이제 필요한 것은 바로 **Memoization** 이다.

클라이언트의 성능이라고 해야될지, 아무튼 메모리를 활용해서 이미 한번 겪었던 로직을 기억해서, 추후에 다시 렌더링이 발생할 일이 생기더라도, 지정한 요소가 변하지 않은 이상 기억한 것을 고대로 사용하기에 서버에도 부담도 덜 주고, 사용자 경험도 크게 개선시킬 수도 있는 것이 큰 특징이다.

## React Memo

React에서는 Memoization 을 사용할 때 **React.Memo** or **useCallback**을 쓰는데, Callback을 다루는게 아닌 컴포넌트 자체를 메모이제이션하려고 하기에 이번엔 React.Memo를 사용해보려고 한다.

사용법은 되게 간단하다. 데이터를 한번 받아오고 그 모습을 정적으로 유지시켜야되는 컴포넌트에, 다시말해 계속해서 onChange같은 State값이 변함에 따라 변모하는 컴포넌트에 공명하여 같이 리렌더링이 발생하는 것을 방지할 컴포넌트에 `React.memo()` 를 씌워주면된다.


```jsx
// B.jsx
import React from 'react'

// List Components
// => 이미 데이터를 받아온 List는 onChange로 인한 리렌더링으로 불필요하게 성능을 저하시키는 요인이 된다.
// 그래서 메모이제이션을 시도해볼만하다.
const List = React.memo(() => {
~~
})

// Text Components
const B = ({text}) => {
 return (
   <div>
     <h1>Components B</h1>
     <p>{text}</p>
   </div>
 ) 
}

```

이런식으로 진행하게되면 드라마틱하게 B컴포넌트가 A보다 훨씬 렌더링 시간이 단축이 되는 것을 확인할 수 있게 된다. 아, 물론 리렌더링 면이다. 초기 렌더링은 의미가 없으며, 다른  props의 변경에 영향을 받지 않게 설정하였고, 영향 받는 컴포넌트는 A는 하나로 묶여있기에 다시 그려야할 그림이 크지만, B는 이제 그렇지 않다.

보니까 useMemo 라는 훅도 있는 것을 확인했는데, 나머지는 좀 더 공부를 해와 다음 프로젝트 개선에 적극적으로 녹여내보는 포스팅을 해보도록 하겠다
