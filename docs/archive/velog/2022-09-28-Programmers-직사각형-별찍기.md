---
title: "[프로그래머스 JS] Level 1. 직사각형 별찍기"
slug: "Programmers-직사각형-별찍기"
date: "2022-09-28T00:51:30.668Z"
updated: "2026-10-17T15:20:55.651Z"
tags: ["JavaScript","알고리즘","코딩테스트","프로그래머스"]
series: "Coding Test"
description: "javascript algorithm"
thumbnail: null
source: "https://velog.io/@buddle6091/Programmers-직사각형-별찍기"
velog_id: "78822117-0f52-4446-8a6b-c463fd91ec98"
---

>풀이과정은 항상 주석으로 남깁니다~
>> 출처 : https://school.programmers.co.kr/learn/courses/30/lessons/12969

#### ❓ 문제설명

![](https://velog.velcdn.com/images/buddle6091/post/dcf0a18d-25c1-4995-9766-5dfbff2272be/image.png)

---

#### 문제
```javascript
process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    const n = data.split(" ");
    const a = Number(n[0]), b = Number(n[1]);
    console.log(a);
    console.log(b);
});
```
---
#### ✨ 풀이 방법
```javascript
process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    const n = data.split(" ");
    const a = +n[0], b = Number(n[1]);  // 키보드로 찍은거 공백 기준으로 나누고 문자열 -> 숫자
  // 이때 Number() 로 형변환을 하지 않아도 자체 변수에 연산을 하여 숫자로 인식하는 방법도 있다.
    
  // for문으로 반복하는 방법도 있지만, 이번에는 문자열을 변수 만큼 반복할 수 있는 repeat()를 사용해보았다.
    const row = "*".repeat(a);              // * 을 a 만큼 반복하여 가로열 생성
    
    for (i = 0; i < b; i++){
        console.log(row);                 // b만큼 채우면 완성
    }
});
```
