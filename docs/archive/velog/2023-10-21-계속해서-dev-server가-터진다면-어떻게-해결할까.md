---
title: "계속해서 dev server가 터진다면? 어떻게 해결할까"
slug: "계속해서-dev-server가-터진다면-어떻게-해결할까"
date: "2023-10-21T04:34:20.787Z"
updated: "2026-11-05T10:26:41.109Z"
tags: ["dev","server","프론트엔드"]
series: "✨Today I Learn (TIL)"
description: "한 몇 달 전부터 dev server을 열어서 작업을 할 때 얼마 안가, 갑자기 변경점이 페이지에서 적용이 안되는 것을 확인하게 되었다.터미널을 보면 컴파일을 시도할 때, 이런 에러가 보이면서 dev server가 터졌다는 것을 알아 낼 수 있었다.계에에에속 이런 에러"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/2047da33-52a2-4d2e-890f-c00156549e81/image.png"
source: "https://velog.io/@buddle6091/계속해서-dev-server가-터진다면-어떻게-해결할까"
velog_id: "127befe1-ec24-4812-9306-e56f5bc3f130"
---
# 문제의 발단

한 몇 달 전부터 dev server을 열어서 작업을 할 때 얼마 안가, 갑자기 변경점이 페이지에서 적용이 안되는 것을 확인하게 되었다.
터미널을 보면 컴파일을 시도할 때, 이런 에러가 보이면서 dev server가 터졌다는 것을 알아 낼 수 있었다.

```terminal
[Error: UNKNOWN: unknown error, open '.next\static\chunks\amp.js'] {
  errno: -4094,
  code: 'UNKNOWN',
  syscall: 'open',
  path: '\.next\\static\\chunks\\amp.js'
}
- error [Error: UNKNOWN: unknown error, open '.next\static\chunks\amp.js'] {
  digest: undefined
}
[Error: UNKNOWN: unknown error, open '.next\static\chunks\amp.js'] {
  errno: -4094,
  code: 'UNKNOWN',
  syscall: 'open',
  path: 'wooridongne\\.next\\static\\chunks\\amp.js'
}
[Error: UNKNOWN: unknown error, open 'wooridongne\.next\static\chunks\amp.js'] {
  digest: undefined
}
- error [Error: UNKNOWN: unknown error, open '.next\static\chunks\amp.js'] {
  errno: -4094,
  code: 'UNKNOWN',
  syscall: 'open',
  path: '.next\\static\\chunks\\amp.js'
}
[Error: UNKNOWN: unknown error, open 'wooridongne\.next\static\chunks\amp.js'] {
  errno: -4094,
  code: 'UNKNOWN',
  syscall: 'open',
  path: '.next\\static\\chunks\\amp.js'
}
```
계에에에속 이런 에러가 뜨면서 서버가 터지는데, 다른 직군은 깊게 체험해보지 못해서 잘 모르겠지만, 수시로 컴파일하여 변경점을 확인해야되는 프론트엔드 개발자에게는 쥐약이다. 
물론 start 가상 빌드 버전으로 돌리는 것도 가능하지만, 내가 하는 것은 next 프레임워크를 사용한 프로젝트들 뿐이라 next start 로 사용하면, 일일히 변경점들을 build 하고 다시 start하고 해야 되었기 때문에 이 부분도 많이 거슬려서 해결했어야만 했다.
(위의 코드에서 보안상 이슈로 정확한 루트는 지우게 된 점 양해바랍니다.)


# 원인을 찾아보자

그렇다면 원인이 뭘까.. 진짜 이것 때문에 작업속도가 2배 이상은 느려졌다고 말해도 과언이 아닐 정도로 너~~~무 불편했다.🤮 

그래서 구글링을 열심히 해서 원인들을 찾아보게 되었는데, 역시 혼자 개발을 진행하고 해결하려고 했던 짬밥이 있었는지 한글 보다는 영어로 구글링을 해보았고, 비슷한 사례들을 해결했던 것을 볼 수 있었다.

## 운영체제 이슈에요

github 내에서 커뮤니티가 있는데 이러한 오류를 올려놓고 각자 댓글을 달아서 어떻게 해당 이슈를 해결했는지 적는 부분이 있다.
여기서 어떤 사용자 분은 운영체제와 현제 npm이 모종의 이유로 맞지않아서 포멧 후 다시 해보니 이런 현상이 깔끔하게 사라졌다고 한다.

하지만, 프로귀찮러로써 이러한 불필요한 시간낭비를 하고 싶지 않아 더 효율적인 방법을 찾아 나서기로 했다. 이 방법은 최후의 보루로...

## 빌드 폴더 자체를 없애보자

에러 내용을 보면 빌드 폴더에서 발생한 이슈이기에, 빌드 폴더를 지웠다.
그 후 실행하면 해결은 된다. 잘 컴파일도 반영하고.
그치만 애시당초에 next는 dev서버를 열어도 임시 빌드파일을 생성하게 되고 몇 차례의 컴파일을 진행하다 보면 다시 똑같은 오류와 마주하게 된다.

그래서 이건 패스!

## npm 을 다시 지웠다 깔아보세요

node를 전역으로 설치했기에, __C드라이브에 깔려있는 node cache를 삭제하면 해결됩니다.__ 라고 해서 시도를 해보았다. 하지만, 위의 해결방법과 같이 비슷한 구조인 것 같았다. 똑같이 문제가 발생하더라구 ㅠ

## chat GPT에게 물어보다

그래서 물어봤다! GPT 에게.
답은 아래와 같았다.

>이 오류 메시지는 파일 시스템 접근 시 발생하는 문제를 나타냅니다. "UNKNOWN: unknown error"와 함께 나오는 에러 코드는 해당 오류가 시스템에서 정확하게 식별되지 않았음을 의미합니다. 이러한 유형의 오류는 다양한 원인으로 발생할 수 있으며, 문제를 해결하기 위해 몇 가지 가능한 접근 방식을 시도해 볼 수 있습니다.
- 파일 또는 디렉토리 잠금 확인: 다른 프로세스나 프로그램이 해당 파일 또는 디렉토리를 사용 중이거나 잠근 경우가 있습니다. 다른 프로그램이 해당 파일을 사용하고 있는지 확인하십시오. 이 파일을 다른 프로세스가 열려 있는 경우, 해당 프로세스를 종료하거나 파일을 해제해야 할 수 있습니다.
- 디스크 공간 확인: 디스크 공간이 부족한 경우 파일을 생성하거나 열 수 없을 수 있습니다. 디스크 공간을 확인하고 필요한 경우 추가 공간을 확보하세요.
파일 및 디렉토리 권한 확인: 해당 파일 및 디렉토리에 대한 쓰기 및 읽기 권한을 확인하십시오. 파일이나 디렉토리에 필요한 권한이 있는지 확인하세요.
- 시스템 로그 확인: 운영 체제의 시스템 로그에 추가 정보가 기록되어 있을 수 있습니다. 이 로그를 확인하여 더 자세한 정보를 얻을 수 있습니다.
백신 소프트웨어 또는 방화벽 검사: 보안 소프트웨어가 파일 액세스를 차단하고 있는지 확인하십시오. 잠시 동안 보안 소프트웨어를 비활성화하고 시도해 볼 수 있습니다.
- Node.js 및 패키지 업데이트: Node.js 및 사용 중인 패키지(예: npm)를 최신 버전으로 업데이트하십시오. 종종 오류는 이러한 업데이트를 통해 해결될 수 있습니다.
파일 복구 또는 백업: 파일 또는 디렉토리가 손상되었거나 파일 시스템에 문제가 있는 경우, 백업에서 해당 파일을 복원해 보세요.

## 공간 문제였던 것 같다.

~~그 중에 **디스크 공간 확인**이라는 부분에 가장 눈길이 갔다. 이유가 뭐냐면, 프로젝트 하나 더 만들 공간 정도밖에 안남은 약 5GB의 용량만 수용할 수 있는 상태였기 때문이다.~~

~~그래서 혹시나 하는 마음에 C드라이브 정리를 하게 되었다.
5GB 남은 C드라이브가 25GB 까지 공간을 확보하였고, 그 후에는 dev server가 잘만 유지가 된다.~~

금일 맘 잡고 해결해보자 해가지고 2시간 동안 찾아 해메서 해결했지만, 언젠가 또 이러한 이슈가 발생할 지도 모른다.
이러한 문제가 발생할 때, 무엇을 해야 완벽히 해결된다~ 라고 나온게 없어서 또 문제가 생긴다면 다시 포스팅해보도록 하겠다.

개발할 때 정말 신경써야될 부분이 여러개 인것을 많이 느끼게 되었다 ㅎㅎ

## + 공간 문제가 아니다.

아이고 잘만되다가 다시 나오기 시작했다 이 에러가.
그래서 생각을 해봤는데, npm이 정말 많이 나고, yarn이 조금 느리지만 그래도 npm에 비해서 에러 빈도 수가 확연히 적다. 일단 yarn으로 개발 서버를 열고, 추후에 nvm 등을 통해서 node 버전을 다시 뒤집어 엎어야 될 것 같다!
_무언가 프로젝트 작업중에 갑자기 노드 버전을 바꾸면 다른 라이브러리 호환성 문제가 발생할 것 같아, 그럼 귀찮아지기 때문이다 ^^_

## 10.24 해결

node 를 싹 다 갈아엎었다.
기존에 C드라이브에 전역으로 설치한 node를 지우고 다시 LTS 버전으로 업그레이드 하였다.
그랬더니 작업물을 킨지 3시간 째에, 계속해서 컴파일을 시도하였고, 다행히 아직까지 한번도 이 뭣같은 에러는 찾아볼 수 없었다!! 야호

현재 작업하는 외주 프로젝트에는 라이브러리를 안써서 문제가 안생겼지만, 이전에 사용하던 프젝에서는 생길지도 모르지만.. 그래도 해결한 게 뿌듯하다 :)

```terminal
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 1192 ms (306 modules)
- wait compiling...
- event compiled client and server successfully in 451 ms (306 modules)
- wait compiling /(default)/page (client and server)...
- event compiled client and server successfully in 6.1s (757 modules)
- wait compiling...
- event compiled successfully in 820 ms (433 modules)
- wait compiling...
- event compiled client and server successfully in 521 ms (459 modules)
```


