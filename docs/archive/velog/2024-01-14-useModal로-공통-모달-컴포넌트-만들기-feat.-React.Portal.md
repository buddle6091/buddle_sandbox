---
title: "useModal로 공통 모달 컴포넌트 만들기 (feat. React.Portal)"
slug: "useModal로-공통-모달-컴포넌트-만들기-feat.-React.Portal"
date: "2024-01-14T08:41:23.468Z"
updated: "2026-11-10T07:56:57.352Z"
tags: ["Portal","React","typescript","모달","컴포넌트"]
series: "✨Today I Learn (TIL)"
description: "이번 인턴십에서는 원래는 2명의 프론트를 뽑고 회사의 신규 프로젝트를 모조리 끝내버리는 것을 목표로 했다가, 중간에 같이 들어온 한 분이 Run.. 하셨다.그래서 이번에는 프로젝트를 진행하되 빠르게 보다는 뭔가 챌린지 한 것을 시도하면서 한 파트를 확실하게 끝내는 것으"
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/1c8e1ca8-d6b9-456d-9703-de79bcc0412c/image.jpg"
source: "https://velog.io/@buddle6091/useModal로-공통-모달-컴포넌트-만들기-feat.-React.Portal"
velog_id: "24fdbdbe-d39d-4c79-afa1-8c6a085cfcc0"
---
# 서론.. (AKA. 현재 상황 🪂)

이번 인턴십에서는 원래는 2명의 프론트를 뽑고 회사의 신규 프로젝트를 모조리 끝내버리는 것을 목표로 했다가, 중간에 같이 들어온 한 분이 Run.. 하셨다.
그래서 이번에는 프로젝트를 진행하되 빠르게 보다는 뭔가 챌린지 한 것을 시도하면서 한 파트를 확실하게 끝내는 것으로 이야기가 되었다.

고로? 저번 회사에서 시간에 쫒겨 찍어 만들어내는 과정에서 뭔가 빠르게 결정하고 개발로 실현시키는 능력을 길렀다면, 이번에는 그것을 바탕으로 내실을 다지는 (?) 그런 개발을 해보려고 한다.

![](https://velog.velcdn.com/images/buddle6091/post/634fd76e-ca84-40cb-89f0-2c7fb61afd20/image.png)

사실 이미 프로젝트 시작하자마자 피그마 분석해서 몇 개 만들고 있었기에 현 시점에서는 거의 다 만들긴 했다.. 

---

# Portal을 사용하여 공통 모달 컴포넌트 만들기

그래서 오늘은 위의 사진 속의 `Modal (모달창)`,`Popup (팝업창)` 에 대해서 작업했던 것을 설명하려고 한다. 

## 이전에 Modal을 만들었던 방식

```typescript

// UseModal.tsx

const UseModal = ({ info }: ModalProps) => {
  const router = useRouter();

  const BackHandler = () => {
    router.push("/login");
  };

  return (
    <MainWrap>
      <Modal>
        <Ooops className="url">Ooops..</Ooops>
        <SadMascotImg
          src="/icon/MascotError.svg"
          width={98}
          height={92}
          alt="creplanet mascot"
        />
        <Info>{info}</Info>
        <BackButtonContainer>
          <BackButton onClick={BackHandler}>뒤로가기</BackButton>
        </BackButtonContainer>
      </Modal>
    </MainWrap>
  );
};

/* ~~~ 페이지에서 Url 복사하게 해주는 모달창 */
export const UrlModal = ({ isOpenModal, setIsOpenModal }: UrlModalProps) => {
  const url = window.location.href;

  const copyHandler = () => {
    copyToClipboard(url);
    closeHandler();
  };

  const closeHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflow = "unset";
  };

  return (
    <MainWrap>
      <ModalBg onClick={(event) => closeHandler}>
        <Modal className="url">
          <CloseBtnWrap>
            <CloseBtn
              src="/icon/Close.svg"
              alt="close"
              width={18}
              height={18}
              onClick={closeHandler}
            />
          </CloseBtnWrap>
          <Ooops className="url">Share URL</Ooops>
          <SadMascotImg
            src="/image/MascotWink.png"
            width={90}
            height={84}
            alt="creplanet mascot"
          />
          <Info className="url">URL을 복사하실껀가요?</Info>
          <UrlButtonContainer>
            <UrlDiv>
              <p>{url}</p>
            </UrlDiv>
            <UrlButton onClick={copyHandler}>복사</UrlButton>
          </UrlButtonContainer>
        </Modal>
      </ModalBg>
    </MainWrap>
  );
};

export default UseModal;
```

위의 코드처럼 뭐 공통으로 사용가능한 컴포넌트를 만들려고는 했으나, 까보면 그냥 Modal 관련된 코드들을 한 곳에 모아두고 직접적으로 페이지 컴포넌트에서 불러서 다음과 같이 사용했었다.

```typescript
// index.tsx

import { UrlModal } from "@/components/useModal";

const [isOpenModal, setIsOpenModal] = useState(false);

return (
 {isOpenModal == true ? (
        <UrlModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      ) : null}
)
```

물론 이 방식도 크게 문제가 되진 않지만, 이건 customHook이 아니라 그냥 같은 모달 컴포넌트를 싸그리 박아놓은 것 뿐이다. 그래서 뭔가 이번엔 진짜 hook 을 만들어보자라는 차원에서 React Portal을 이용하여 useModal, usePopup 이라는 훅을 제작하게 되었다.

## Portal이란?

Modal은 원래 기본 보이는 View에서 상호작용을 통하여 해당 View위에 Modal View를 까면서 아래의 View에 영향이 가하지 않는 상태로 만드는 특징이 있다.

그동안 했던 방식은 부모 컴포넌트 내에 사용된 Modal, 그러니까 children이 DOM 내부에 랜더링이 되면서 다른 컴포넌트에 겹쳐서 밀려나거나 그랬기에, z-index를 무자게 조정하면서 개발하여야했는데, React Portal은 그렇지 않다.

> _"Portal은 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링하는 최고의 방법을 제공합니다."_ - React 공식홈페이지

이 뜻은 Modal, Popup 과 같은 컴포넌트에게 부모 컴포넌트의 DOM 구조에서 벗어나 렌더링하기 좋은 구성을 제공해준다 라고 설명도 된다.

그럼 이제 진짜로 hook을 만들어보자.

## Portal을 사용해보자

우선 Portal이라는 것을 잘 활용하려면 다른 부모 컴포넌트들이 불러와지는 `root` 요소와 같은 위치에 있는 DOM 객체를 지정하여 연결시켜줘야 한다. 나는 `modal` 이라고 지었다.

```html
// index.html
...
 <body>
    <div id="root" />
    <div id="modal" />
    <script type="module" src="/src/main.tsx"></script>
  </body>
```
이렇게 만든 modal이라는 div값을 Portal을 생성하는 파일과 연결하여 사용하면 되는데, 나는 Modal 이외에 Popup이라는 친구도 같은 Modal 객체를 사용할 것이라 따로 Portal 전용 파일을 분리하였다.

```typescript
// Portal.tsx

import React from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

const ModalPortal = ({ children }: PortalProps) => {
  const modalRoot = document.getElementById("modal") as HTMLElement;
  console.log(modalRoot);
  return ReactDOM.createPortal(children, modalRoot);
};

export default ModalPortal;
```
`document.getElementById`를 통해 아까 만든 `<div id="modal"/>` 에 접근하여 변수에 저장을 한 후에 ReactDOM.createPortal(children, modalRoot) 를 반환해 준다.
여기서 createPortal의 매개변수로는 children 컴포넌트, 즉 포탈을 통해 계층 밖으로 보내주는 대상 그리고, 이 children을 렌더링할 modal 이라는 DOM Element를 인자로 받는다.

## Modal 컴포넌트 만들기

우리가 아까 전에 만들었던 `Portal.tsx` 를 사용할 때가 왔다!
```typescript
import { useEffect } from "react";
import * as S from "./styled";
import ModalPortal from "./Portal";

interface ModalProps {
  isModalOpen?: boolean;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const ModalComponent = ({ open, onClose, children }: ModalProps) => {

  if (!open) return null;

  return (
    <ModalPortal>
      <S.ModalWrapper>
        <S.ModalOverlay />
        <S.ModalContainer>
          <S.CloseButtonContainer>
            <img
              src="/icons/icon-close-20.svg"
              alt="모달창 닫기 버튼"
              onClick={() => onClose()}
            />
          </S.CloseButtonContainer>
          {children}
        </S.ModalContainer>
      </S.ModalWrapper>
    </ModalPortal>
  );
};

export default ModalComponent;

export const FilterModalComponent = ({
  open,
  onClose,
  children,
}: ModalProps) => {
// 필터를 보여주는 모달의 공통 외형
};

export const ListModalComponent = ({
  open,
  onClose,
  children,
}: ModalProps) => {
// 목록을 보여주는 모달의 공통 외형
};

```
위와 같이 portal를 사용한 컴포넌트를 최상위 요소로 래핑해준다.

그러고나서 기본적으로 사용할 컴포넌트의 외형을 파악하고, 비슷한 구조만 useModal hook 내에서 UI 컴포넌트를 Emotion으로 형성해놓고 각각에 쓰임에 맞게 사용하기 위해 Children Props를 내려서 자세한 사항을 받게 개발하였다.

물론 구조 자체가 좀 달라서 children으로 부모 요소까지 변경하기 어려운 부분들은 따로 다른 컴포넌트로 빼서 사용한다.

## 사용되는 예제

이렇게 만들어진 모달 훅을 페이지 컴포넌트에 불려내는 과정을 작성할 때이다.
필요한 재료는 아까 만든 useModal customHook, 그리고 안에 children으로 내려줄 커스텀 모달 컴포넌트이다.

팝업 또한, useModal과 다를게 없이 똑같은 방식으로 제작되었습니다.)

```typescript
// testPage.tsx
import useModal from "@/hooks/useModal";
import usePopup from "@/hooks/usePopup";
import TestModal from "@/components/testPage/testModal";
import DefaultPopup from "@/components/testPage/DefaultPopup"

/**Login Page */
const Login = () => {
  /**useModal */
  const { Modal, openModalHandler } = useModal();

  /* 에러 핸들링 - 팝업 */
  const { Popup, openPopupHandler, closePopupHandler } = usePopup();
  const [info, setInfo] = useState("");

  return (
    <>
      <Modal>
    /* 여기서 커스텀 모달을 부여하여 컨셉에 맞는 기능을 조립해준다. */
        <TestModal />
      </Modal>

      <Popup>
    /* 여기서 커스텀 팝업을 부여하여 컨셉에 맞는 기능을 조립해준다. */
        <DefaultPopup info={info} onClose={() => closePopupHandler()} />
      </Popup>

      <S.MainWrapper>
   ...
      </S.MainWrapper>
    </>
  );
};

export default TestPage;
```

위처럼 개발하게 되면 모달과 팝업을 띄울 수 있게 되는데, 아래와 같은 이미지로 볼 수 있다.
순서는 모달창 컴포넌트에서 팝업을 불러오게 코드를 작성하여서 두가지의 모습을 한 번에 보여주려고 한다.
![](https://velog.velcdn.com/images/buddle6091/post/72e32afe-57fa-47aa-a825-61f97c54c8df/image.png)

이렇게 컴포넌트를 따로 분리하여서 레고처럼 필요한 부분만 끼워 맞추게 개발하면 컴포넌트를 작성하는 코드도 개발하는 리소스도 확연하게 줄일 수 있는 성과를 볼 수 있다.
일일이 각각의 컴포넌트들의 상태 값을 하나로 묶어서 관리하기 때문에, 상태관리 또한 한숨 놓을 수 있게 되고 말이다.


## 모달에 추가적으로 부여한 기능들

모달은 켜졌을 때, 뒷 배경 요소들에게 스크롤 등의 이벤트가 가해지면 안되며, 모바일 뷰도 지원하는 페이지라면, 모바일에서 뒤로가기를 눌렀을 시에 이전 페이지로 가는 이벤트 대신에 모달창이 닫히는 이벤트가 필요하다.
해당 기능들을 추가로 작성하는 것으로 이번 포스트를 끝맺으려고 한다.

### 스크롤 이벤트 막기
useModal hook에서 사용되는 공통 부모 모달 컴포넌트에서 작성한다.
아래와 같이 useEffect로 컴포넌트가 켜졌는지 `open` 값을 감시하고, 켜지게되면 스크롤을 없애는 기능을 보여준다.

```typescript
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    if (!open) {
      document.body.style.overflow = "auto";
    }
  }, [open]);
```



### 뒤로가기 이벤트 막기

모달을 여러번 만들어봤지만, 어리석게도 이런 기능이 꼭 필요하다는 생각을 간과하게 되었다.

생각해보자. 나같았어도 모바일 뷰로 되어있는 페이지에서 팝업이나 모달이 열렸을 때, 닫기 버튼을 누르는 것 보다 모바일 기기에서 지원하는 뒤로가기 제스쳐를 많이 활용하는 편인데, 내가  열심히 작성한 폼이 이전페이지로 넘어가서 날라가버리는 어처구니 없는 상황이 발생한다면? 

굉장히 짜증날 것 같다.. 🤬

그래서 아래와 같이 뒤로가기 이벤트가 발생했을 시에 뒤로가기 이벤트를 cancle하고 대신에 onClose가 작동되는 함수를 만들었다. 이것 또한 useEffect 로 뒤로가기 이벤트가 작동되는지 감시하는 것이 기반이다.

```typescript
  /* 뒤로가기 이벤트 감지 시, 해당 이벤트 대신 unMount */
  useEffect(() => {
    const preventGoBack = () => {
      history.go(1);
      onClose();
    };

    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
  }, [onClose]);
```

# 결론

이번에 기존에 그냥 사용했던 방식보다, Portal을 사용하여 모달과 팝업을 개발하고 더 나아가 공통 컴포넌트로 만들어 최대한 효율을 높이는데 집중을 했다.
결과는 만족이다!!
다만, 이번 개발을 통해서 왜 유저친화적인 개발을 강조하는데에도 불구하고 뒤로가기 버튼에 대한 문제를 고민해본 적이 없다는 것에 약간의 공허함을 느끼게된다. 이 공허함은 내 자신이 내뱉는 말을 지키지 못해서 나오는 허무함과 상실함인것으로 보인다.

그래도 여러 경험을 통해서 계속 성장하는 게 요샌 보여가지구 뿌듯함도 챙겨간다.

> Reference 
[React 공식 홈페이지 - Portals](https://ko.legacy.reactjs.org/docs/portals.html)
[3년차가 React Portal을 모른 썰](https://velog.io/@himprover/3%EB%85%84%EC%B0%A8%EA%B0%80-React-portal-%EB%AA%A8%EB%A5%B8-%EC%8D%B0)
