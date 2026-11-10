---
title: "useController 로 form 최적화 시도, 그리고 비제어 컴포넌트를 경험해보다."
slug: "useController"
date: "2024-02-12T07:08:30.667Z"
updated: "2026-10-31T05:24:29.569Z"
tags: ["React","form","react-form-hook","useController","비제어컴포넌트"]
series: "✨Today I Learn (TIL)"
description: "이전에 나름 Props로 Input을 쉽게 관리하려고 노력해봤지만 의도와는 다르게 개발했던 경험이 있다. 그래서 이번에는 타입스크립트를 최대한 활용해서 개발을 진행했다."
thumbnail: "https://velog.velcdn.com/images/buddle6091/post/93ecc939-e637-4d61-b437-636815e94da4/image.jpeg"
source: "https://velog.io/@buddle6091/useController"
velog_id: "4cfe7056-7e88-42d4-b032-e6aad5fe83a2"
---
# Props로 자유롭게 관리할 수 있는 Input을 만들다

이전에 나름 Props로 Input을 쉽게 관리하려고 노력해봤지만 의도와는 다르게 개발했던 경험이 있다. 그래서 이번에는 타입스크립트를 최대한 활용해서 개발을 진행했다.

```typescript
export type InputStatus =
  | "ERROR"
  | "DISABLED"
  | "INFO"
  | "NOLABEL"
  | "READONLY"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  status: InputStatus;
}

const Input = ({ ...props }: Props) => {
  return <S.TextBox {...props} />;
};
```

status는 추후에 Validation 및 현재 input의 기획 상태에 따라서 UI 및 기능 설정을 달리하기 위해서 정적인 형태 (string 값) 으로 정한 지정값이다.
여기에 useInput 커스텀 훅을 개발해서 form 최적화와 함께 status를 엮으려고 했었다.

interface Props 는 html의 기본 Input 요소를 타입으로 명시된 것을 확장하여 사용함으로써, 각 사용되는 부분마다 필요없는 기본 props는 따로 적지 않아도 타입에러가 나오지 않아서 자유도가 높아졌다는 것을 느끼게 되었다.


# react-hook-form으로 input Control하기

그런데 웬지 모르게 react-hook-form이 무쟈게 쓰고 싶었다. 아마 이전에 이 라이브러리를 제대로 짚고 넘어가지 않아서 그런 것이 가장 큰 이유인가 싶다.

위의 status 라는 custom props 값으로 기본적으로 정보 알림용, 에러 용도의 caption을 관리하려고 했는데, react-hook-form으로 사용하면 자체적으로 제공해줘가지고, 일련의 노력이 물거품되는 것 같기도 하지만.. ㅎㅎ

## 왜 react-hook-form 을 사용하면 form 최적화가 될까?

우리가 기본적으로 form의 상태들을 관리하려면 해당 내용들을 다 state로 관리하게 될 것이다.
물론 state로 관리하기 때문에 각각에 대한 상호작용 등의 처리는 커스텀하기 용이하긴 할 것이다.

하지만 이렇게 되면 아래처럼 state를 줄줄이 사용하고, 입력할 때마다 state 값을 건들이기 때문에 불필요한 리렌더링이 발생하기 마련이다.

이러한 특성을 React 의 Controlled Components, 즉 제어형 컴포넌트라고 한다.

### 제어형 컴포넌트 (Controlled Components)

제어형 컴포넌트는 React에 의해서 입력값이 관리되는 컴포넌트로 크게 `<input>, <textarea>, <select>` 가 사용자 입력을 관리하기에 예라고 볼 수 있다. 이 요소들은 state를 통해서 상태를 관리하고 `setState` 함수로 업데이트를 시도한다.

React 단에서는 React State를 SSOT (Single Source Of Truth) 신뢰할 수 있는 단일 출처로 만들어서 state 값과 입력 값을 결합할 수 있고 이를 통해 form을 관리할 수 있게 제어할 수 있게 해주는 컴포넌트를 제어 컴포넌트라고 한다.

하지만 제어 컴포넌트는 state가 업데이트될 때마다 리렌더링을 시도하게 되고, 이렇게 되면 불필요한 리렌더링이 잦아져 성능에 영향을 끼치게 된다.

### 비제어형 컴포넌트 (Uncontrolled Components)

state의 변경점에 따라서 React 컴포넌트를 제어하는 제어 컴포넌트와는 다르게 비제어 컴포넌트를 활용하게 되면 React의 State 값이 아닌 직접 Dom에 접근하여 값을 읽어오는 방식이기에 불필요한 리렌더링 횟수를 줄일 수 있다.
React에서는 Dom에 접근하여 데이터를 만질 수 있게 `Ref` 라는 요소를 제공해 준다.

함수형 컴포넌트는 인스턴스가 존재하지 않기에, 클래스 컴포넌트의 `React.createRef()` 대신에 `useRef` 라는 react hook을 활용하여 ref 객체를 생성 후 컴포넌트에 사용하는 형태이다.

useRef를 사용하게 되면 current 값을 변경시킬 수 있는데, 이때 이 current 값을 변경되어도re-rendering이 발생하지 않는다.

그동안 ref를 사용한 거라면 뭐.. 크게 이미지 업로드 input 대신에 옆에 있는 버튼을 누르면 업로드 창을 열릴 수 있게?

```typescript

const ImageContainer = ({ image }: props) => {
  const [getValue, setValue] = useState("default");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (getValue === "default") {
      image("blob:http://localhost:3000/images/img.png");
    }
  };

  /**이미지 선택 ref */
  const Ref = useRef<HTMLInputElement>(null);

  const fileHandler = () => {
    // ! 를 통해서 타입 컴파일러에게 확신을 심어주기
    if (ref) {
      ref.current!.click();
    }
  };

  const getViewByValue = () => {
    if (getValue === "default")
      return (
        <S.DefaultImageBox>
          <img src="/images/img.png" alt="이미지" />
        </S.DefaultImageBox>
      );
    if (getValue === "custom")
      return (
        <>
          <S.InputWithButtonContainer className="second">
            <ImageUploadBox
              placeholder="이미지를 등록해 주세요."
              ref={ref}
            />
            <Button
              type="button"
              size="MEDIUM"
              buttonColor="WHITE"
              buttonBgColor="BLACK"
              onClick={() => fileHandler()}
            >
              파일찾기
            </Button>
          </S.InputWithButtonContainer>
          <S.CaptionContainer>
            <span>* 정사각형 비율 권장</span> <br />
            <span>* 용량 10MB이하의 JPG, PNG만 업로드 가능</span>
          </S.CaptionContainer>
        </>
      );
  };
```

이제 이 비제어 컴포넌트가 React-hook-form 내에서 어떤 위치이며 이것을 어떻게 활용했는지 아래에서 설명하면서 부연설명하려고 한다.

[React-Hook-Form 공식 홈피](https://react-hook-form.com/)를 들어가면 제어형 form과는 다르게 React hook form은 독립적인 폼 컴포넌트를 지원하기 때문에 리렌더링이 적으며, 향상된 컴포넌트 속도를 보여준다라고 설명한다.

![](https://velog.velcdn.com/images/buddle6091/post/0c5ea32c-0ffb-48e4-8d5c-c0c3d793ac24/image.png)

그리고 API 에서 useController라는 기능이 있는데 이 hook을 활용해서 기존 제어형 컴포넌트에 씌우면 비제어 컴포넌트로 활용할 수 있게 된다.

## useController 사용하기

```typescript
export const InputWithLabel: React.FC<TextInputProps> = ({
  labelText,
  rules,
  ...props
}) => {
  const { field, fieldState } = useController({ ...props, rules });

  const getStatusByFieldState = () => {
    switch (fieldState.invalid) {
      case true:
        return "ERROR";
      case false:
        return "INFO";
      default:
        return "INFO";
    }
  };

  return (
    <>
      <S.Label status={getStatusByFieldState()}>
        <Input status={getStatusByFieldState()} {...props} {...field} />
        {fieldState.error && <span>{fieldState.error.message}</span>}
        {!fieldState.error && <span className="info">{labelText}</span>}
      </S.Label>
    </>
  );
};

```

따로 `Controller` API 를 Input에 덮는 것으로 register 기능을 꺼내어 사용할 수 있지만, 코드량 및 유지보수에 기여하는 것은 `useController`가 더 뛰어나다고 생각한다. (재사용이 가능하기 때문!!) 
`Controller`가 궁금하신 분들은 [여기](https://react-hook-form.com/docs/usecontroller/controller)를 참조하시길 바란다.

암튼 이렇게 `useController`를 통하여 field 값들을 가져오게 되면, 추후에 useForm에서 내에서 다음과 같이 사용가능해진다.

```typescript
  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm<FieldValues>({
    mode: "onChange",
  });


  return (
    <>
      <S.StoreInfoWrapper onSubmit={handleSubmit(onSubmit)}>
        <S.InfoTitleContainer>
          <span>가게 정보</span>
          <hr />
        </S.InfoTitleContainer>
        <S.Col>
          <S.SubTitleContainer>
            <span>가게 이름</span>
            <span className="star">*</span>
          </S.SubTitleContainer>
          <S.InputContainer>
            <InputWithLabel
              name="storeName"
              placeholder="가게 이름을 입력해 주세요."
              control={control}
              defaultValue={storeData.storeName}
              rules={{
                required: "가게 이름을 입력해 주세요.",
              }}
            />
          </S.InputContainer>
```

# Ref 에러의 등장

처음에는 이 자체만으로 비제어 컴포넌트를 활용했다고 생각했지만 다음과 같은 에러를 보게 된다.

![](https://velog.velcdn.com/images/buddle6091/post/bc532cf5-22d4-475c-a9b1-a0fecf93292f/image.png)

원인은 정말 알기 쉽게 에러메시지 그대로이다. ref를 사용하여 DOM 데이터를 조작하기 위해 만들어져있는데, 함수형 컴포넌트로 Props 전달용으로 사용되기에 forwardRef를 통해 ref를 전달해 볼래? 이다.

말그대로 forwardRef 함수를 react에서 가져와 parameter 앞단 부터 감싼 후에, ref객체를 받는 형식으로 작성하면 에러는 사라진다!

```typescript
export const InputWithLabel: React.FC<TextInputProps> = forwardRef(
  ({ labelText, rules, ...props }, ref) => {
    const { field, fieldState } = useController({ ...props, rules });

    const getStatusByFieldState = () => {
      switch (fieldState.invalid) {
        case true:
          return "ERROR";
        case false:
          return "INFO";
        default:
          return "INFO";
      }
    };

    return (
      <>
        <S.Label status={getStatusByFieldState()}>
          <Input
            status={getStatusByFieldState()}
            {...props}
            {...field}
            ref={ref}
          />
          {fieldState.error && <span>{fieldState.error.message}</span>}
          {!fieldState.error && <span className="info">{labelText}</span>}
        </S.Label>
      </>
    );
  }
);
```

이렇게 뭔가 2지 선다를 주는 것 마냥 **React.forwardRef() 를 사용하시겠습니까?** 라는 형식의 에러는 처음본다. 신기하다!
위에서 언급했듯이 react-hook-form 내에서 사용되는 API 가 ref 객체를 내부적으로 사용하고 있기 때문에, 해당 기능을 활용해 컴포넌트를 작성하면 알아서 ref 사용을 권장하는 것이 좀 많이 신기했다. 
그 덕분에 `forwardRef()`를 사용하여 props를 전달하는 것 마냥 컴포넌트를 작성할 수 있는 경험도 얻고..  ㅎㅎ

# useController를 사용하면서 알게된 에러

## Control 객체가 가질 수 있는 타입

이제 우리가 만든 이 useController를 활용한 Input 컴포넌트를 활용할 때가 왔다..!!
useForm에 제너릭으로 해당 form에서 다룰 데이터들을 Interface로 만들고 달아주면, 아래 Input 컴포넌트의 `control` 부분에서 에러가 나온다.

에러 내용은 해당 Input 에서 처리하는 부분 이외의 요소들을 처리하지 못한다는 것이다.
예를 들어 해당 form에서는 name, phoneNumber, email 이렇게 3개의 input 값을 관리를 한다면, 아래의 Input에서는 name만 받기에 나머지 요소를 control 객체에서 처리하지 못한다는 이야기이다.

```typescript

const {
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm<InfoProps>({
    mode: "onChange",
  });

  return (
    <>
      <S.StoreInfoWrapper onSubmit={handleSubmit(onSubmit)}>
        <S.InfoTitleContainer>
          <span>내 정보</span>
          <hr />
        </S.InfoTitleContainer>
        <S.Col>
          <S.SubTitleContainer>
            <span>내 이름</span>
            <span className="star">*</span>
          </S.SubTitleContainer>
          <S.InputContainer>
            <InputWithLabel
              name="name"
              placeholder="이름을 입력해 주세요."
              control={control}
              defaultValue={storeData.name}
              rules={{
                required: "이름을 입력해 주세요.",
              }}
            />
          </S.InputContainer>
        </S.Col>
```

하지만 오랜 시간 꾸준하게 삽질해 온 결과 파훼법(?) 을 찾아 낸 것 같기도 하다.

### Interface에 전부 optional 로 지정하기

```typescript
export interface InfoProps {
  name?: string;
  phoneNumber?: string;
  email? : string;
}
```

이렇게 다 옵셔널로 지정해버리면 타입스크립트가 control 객체에 감시하는 값이 조금 누그러지는 듯하다. 

### FieldValues

하지만 뭔가 타입스크립트를 쓰는 보람이 없는 느낌이 들어서 다시 공식 홈페이지를 찾아보다가, FieldValues라는 제공되는 타입을 찾게 되었다.
근데 이것도 약간 any 타입의 느낌이 물씬 나서 불안하긴 하지만 해당 라이브러리에서 제공되는 타입이니 이걸 기용하기로 하였다.

```typescript
export type FieldValues = Record<string, any>
```


> reference
https://velog.io/@boyeon_jeong/React-Hook-Form-Controller-useController-y6v2mfc9
https://velog.io/@leitmotif/Hook-Form%EC%9C%BC%EB%A1%9C-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0
https://wonbeenna.github.io/blog/javaScript/ref-forwardRef
https://github.com/orgs/react-hook-form/discussions/8606
https://www.nextree.io/react-hook-form/
https://eunoia07.tistory.com/entry/REACT-react-hook-form-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-%EA%B5%AC%ED%98%84
https://so-so.dev/react/form-handling/


