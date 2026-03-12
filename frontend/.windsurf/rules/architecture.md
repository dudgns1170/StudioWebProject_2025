---
trigger: always_on
description:
globs:
---

- Feature-Sliced Design (FSD) 아키텍처 준수
- 계층별 의존성 규칙: app → pages → widgets → features → entities → shared
- 각 슬라이스는 api , model , ui, lib 세그먼트로 구성
- Path alias 사용:
  - `@src/*`: 절대 경로 import 필수
  - `@public/*`: 에셋 경로 import
