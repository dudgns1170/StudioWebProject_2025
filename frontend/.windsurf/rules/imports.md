---
trigger: always_on
description:
globs:
---

# Module Imports & Exports

## Import Rules

- Import 순서:
  1. React 관련 라이브러리
  2. 외부 라이브러리
  3. 내부 모듈 (src/\*)
  4. 상대 경로 import
- 그룹 간 빈 줄로 구분
- 알파벳 순 정렬
- Named export 선호, default export는 페이지 컴포넌트에만 적용

---

## Export Rules

### 기본 원칙

- 기본적으로 **named export 사용**을 권장한다.
- 컴포넌트/훅/유틸 파일은 **대표 export 1개**만 둔다.
- export 구문은 파일의 마지막에 놓는다.

---

### Barrel 파일(`index.ts`) 규칙

#### 와일드카드 export(\*) 허용 상황

다음 조건을 모두 만족하면 `export * from "./xxx";` 사용을 허용한다:

1. **파일 내부가 오직 export만 존재하고, 로직이 없다.**  
   (barrel 전용 파일)
2. **하위 모듈들이 모두 named export만 사용한다.**
3. **트리 쉐이킹에 영향을 주지 않으며, API surface가 명확하다.**
4. **"한 디렉토리의 모든 서브모듈을 공개 API로 노출하려는 의도가 명확"한 경우**

즉, 이런 상황에서만 허용:

```ts
// features/user/index.ts
export * from "./useUserQuery";
export * from "./useUserStore";
export * from "./UserCard";
```
