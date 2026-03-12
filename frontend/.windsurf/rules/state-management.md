---
trigger: always_on
description:
globs:
---

- 서버 상태: TanStack Query 사용
- 클라이언트 상태: Zustand 사용
- 타입 안전성: 원시 타입 남용 방지, 복합 타입 활용
- 불변성 유지:
  - 변경 불가능한 속성은 readonly 사용
  - 리터럴은 as const 사용
- 검증 로직은 별도 유틸리티 함수나 클래스에서 처리
- API 응답 타입은 별도 파일에서 정의
