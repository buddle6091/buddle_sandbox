---
title: " <React❗> The above error occurred in the <input> component ~"
slug: "React-The-above-error-occurred-in-the-input-component"
date: "2022-10-05T06:59:50.203Z"
updated: "2026-10-26T22:03:12.630Z"
tags: ["React","error","trouble shooting"]
series: "⚽Trouble Shooting"
description: "항해 주특기 주차 S.A 과제 중에 발생한 문제이다. 터미널에서는 문제가 발견이 되지 않으나, npm start 로 dev server를 열어보니 코드들이 렌더링이 되지 않아 크롬 개발자 창에서 확인하게 된 오류이다.그리고 작성한 코드는 이러하다. (해결 본이며, 이때"
thumbnail: null
source: "https://velog.io/@buddle6091/React-The-above-error-occurred-in-the-input-component"
velog_id: "4d1ca3d9-7a2a-437d-9348-2f28a9417059"
---
`항해 주특기 주차 S.A` 과제 중에 발생한 문제이다. 터미널에서는 문제가 발견이 되지 않으나, `npm start` 로 dev server를 열어보니 코드들이 렌더링이 되지 않아 크롬 개발자 창에서 확인하게 된 오류이다.

```markdown
The above error occurred in the <input> component:

at input
at form
at App
```

그리고 작성한 코드는 이러하다. (해결 본이며, 이때 input 태그를 닫는 태그를 작성했었다.)

```jsx
const App = () => {
  return (
    <form
      action="https://ko.reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute"
      className="submitform">
      <p>First Name :</p>
      <input
        type="text"
        name="First Name"
        className="input bg-white input-bordered input-accent w-full max-w-xs"
        required
      />
      <p>Last Name :</p>
      <input
        type="text"
        name="Last Name"
        className="input bg-white input-bordered input-accent w-full max-w-xs"
        required
      />
      <p>Email :</p>
      <input
        type="text"
        name="Email"
        className="input bg-white input-bordered input-accent w-full max-w-xs"
        required
      />
      {/* react는 친절하게 뭐로 바꿔 쓰라고 설명해 줌. label태그에서 for 대신 htmlFor을 쓰라고 한다. */}
      <p>Gender :</p>
      <input type="radio" name="gender" required />
      <label htmlFor="male">Male</label>
      <input type="radio" name="gender" required />
      <label htmlFor="Female">Female</label>
      <p>Favorite :</p>
      <input type="checkbox" name="lang" value="HTML" />
      HTML
      <input type="checkbox" name="lang" value="JAVA" />
      JAVA
      <input type="checkbox" name="lang" value="JavaScript" />
      JavaScript
      <p>Browser :</p>
      <select name="browser">
        <option value="chrome">크롬</option>
        <option value="safari">사파리</option>
        <option value="edge">엣지</option>
      </select>
      <p>Birthday :</p>
      <input type="date" />
      <br></br>
      <input
        type="submit"
        className="btn btn-active btn-secondary"
        value="제출"
      />
    </form>
  );
};
```

react를 처음 쓰는 나머지 감이 맞게 쓴 것 같아, 일단 위에서 말하는 input 태그에서 힌트를 얻고 input 태그들을 다 지워 보았다.

그랬더니 정상적으로 렌더링 되는 것을 확인 할 수 있었다. 

구글링을 통해 React는 부모 자식 요소의 경계를 명확하게 하여 input 태그 자체를 시작 태그와 동시에 닫기 처리하여 자식요소가 발생하지 않게 함이라고 한다.

요점은 `부모와 자식 요소를 명확히 구분하자`
