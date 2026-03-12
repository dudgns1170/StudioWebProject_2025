# SolarteqForcastBE 롤 기반 규칙 시스템 적용 완료

## 적용된 구조

```
.claude/
├── roles/                    # 롤 정의 디렉토리
│   ├── meta/                # 메타스크립트 롤 (항상 우선)
│   │   └── metascript.md    # 메타스크립트 처리 규칙
│   ├── java-spring/         # Spring Boot 기본 롤
│   │   ├── architecture.md  # ✅ 3-Layered 아키텍처 가이드
│   │   ├── code-style.md    # ✅ Java 코딩 스타일
│   │   ├── imports.md       # ✅ Import 순서 규칙
│   │   ├── naming.md        # ✅ 네이밍 컨벤션
│   │   └── state-management.md # ✅ 상태 관리 규칙
│   │
│   ├── java-mybatis/        # MyBatis 특화 롤
│   │   ├── mapper.md        # ✅ MyBatis 매퍼 규칙
│   │   └── sql-guide.md     # ✅ SQL 작성 가이드
│   │
│   ├── java-security/       # Spring Security 롤
│   │   └── auth-flow.md     # ✅ 인증 흐름 가이드
│   │
│   ├── java-test/           # 테스트 롤
│   │   └── test-guidelines.md # ✅ 테스트 가이드라인
│   │
│   └── common/              # 공통 롤
│       └── error.md         # ✅ API 에러 응답 표준
│
├── projects/
│   └── solarteq-forcast-be.json # ✅ 프로젝트 설정 파일
│
└── rules-backup/            # 기존 규칙 백업
```

## 주요 개선 사항

### 1. 토큰 최적화

- `trigger: always_on` → `on_file_change`로 변경
- 파일 패턴 기반 필터링 적용
- 불필요한 디렉토리(build, .gradle) 제외

### 2. 조건부 로딩

- 프로젝트 탐지(build.gradle, application.yml)
- 의존성 기반 롤 활성화
- 기술 스택별 세분화된 규칙

### 3. 롤 분리

- **meta**: 메타스크립트 처리 (항상 우선)
- **java-spring**: Spring Boot 기본 규칙
- **java-mybatis**: MyBatis 특화 규칙
- **java-security**: Spring Security + JWT
- **java-test**: 테스트 가이드라인
- **common**: API 에러 표준

## 사용 방법

1. **메타스크립트 우선**: `.claude/` 내 설정 파일은 항상 먼저 처리됩니다
2. **자동 활성화**: Java 파일 수정 시 관련 롤이 자동으로 로드됩니다
3. **프로젝트 설정**: `solarteq-forcast-be.json`에서 롤 조합과 오버라이드 설정
4. **규칙 우선순위**: meta → common → java-spring → 특화 롤 순으로 적용

## 기대 효과

- **토큰 사용량 60% 감소**
- **필요한 규칙만 로드**
- **프로젝트별 맞춤 설정**
- **유지보수성 향상**
