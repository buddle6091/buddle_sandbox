---
title: "Argument of type '() => Promise<void>' is not assignable to parameter of type 'SetStateAction<undefined>'."
slug: "Argument-of-type-Promisevoid-is-not-assignable-to-parameter-of-type-SetStateActionundefined"
date: "2023-02-16T15:31:00.507Z"
updated: "2026-10-24T03:16:07.781Z"
tags: []
series: "⚽Trouble Shooting"
description: "Argument of type '() => Promise' is not assignable to parameter of type 'SetStateAction'.  Type 'Promise' is not assignable to type 'undefined'.ts(234"
thumbnail: null
source: "https://velog.io/@buddle6091/Argument-of-type-Promisevoid-is-not-assignable-to-parameter-of-type-SetStateActionundefined"
velog_id: "c31096c2-4103-4e1a-b24e-317cff818ab4"
---
```tsx
const result = async () => {
    const { data } = await axios.get<isFood>("http://localhost:9000/stores");
    console.log(data);
    setData(result);
  };
```

Argument of type '() => Promise<void>' is not assignable to parameter of type 'SetStateAction<undefined>'.
  Type 'Promise<void>' is not assignable to type 'undefined'.ts(2345)
