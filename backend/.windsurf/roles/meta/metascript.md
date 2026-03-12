---
trigger: always_on
description: 메타스크립트 및 롤 설정 처리 규칙
globs: [".claude/**", "**/*.json"]
priority: highest
---

# 메타스크립트 처리 규칙

## 1. 항상 활성화되어야 하는 파일

- **롤 설정 파일**: `.claude/projects/*.json`
- **롤 정의 파일**: `.claude/roles/**/*.md`
- **프로젝트 설정**: `.claude/config.json`
- **워크스페이스 설정**: `.windsurf/rules/*.md`
- **프로젝트 README**: `.claude/README.md`

## 2. 처리 우선순위

1. **메타스크립트** (항상 먼저 처리)
   - 롤 설정 파일 로드
   - 프로젝트별 롤 조합 확인
   - 오버라이드 설정 적용

2. **프로젝트 롤** (메타스크립트 결과에 따라)
   - 조건부 로딩 적용
   - 파일 패턴 기반 필터링

## 3. 예외 처리

- 메타스크립트 파일은 다른 모든 규칙보다 우선
- `trigger: always_on`으로 설정하여 항상 로드
- 다른 롤의 `exclude_patterns`에 영향받지 않음

## 4. 구현 원칙

```yaml
# 메타스크립트는 항상 최우선
trigger: always_on
priority: highest
globs: [".claude/**", "**/*.json"]
# 다른 모든 규칙보다 먼저 실행
```
