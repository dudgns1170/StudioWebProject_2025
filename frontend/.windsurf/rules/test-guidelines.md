---
trigger: always_on
description:
globs:
---

- 테스트 파일 이름은 반드시 _.test.ts 또는 _.test.tsx 형식을 사용한다.
- React 컴포넌트 테스트 템플릿은 Testing Library + Vitest 조합을 사용한다.
- React 컴포넌트 루트 요소에는 컴포넌트 PascalCase 이름과 동일한 data-testid 값을 포함해야 한다.
- 기본 생성 테스트 항목:
  - 렌더링 테스트
  - 스냅샷 테스트
- 유틸 함수 테스트는 다음 두 가지 케이스를 기본으로 생성한다:
  - 정상 동작 케이스
  - 엣지 케이스
- describe / it / expect 패턴을 사용한다.
