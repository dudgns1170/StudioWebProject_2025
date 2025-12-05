# StudioPick Backend

Spring Boot 기반 스튜디오 예약 플랫폼 백엔드 API 서버입니다.

## 기술 스택

- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL / H2 (개발용)
- AWS S3
- Swagger (API 문서)

## 시작하기

### 개발 환경 실행

```bash
# Gradle Wrapper 사용
./gradlew bootRun

# 또는 Windows
gradlew.bat bootRun
```

### 빌드

```bash
./gradlew build
```

### 테스트

```bash
./gradlew test
```

## API 문서

서버 실행 후 Swagger UI 접속:
- http://localhost:8080/swagger-ui.html

## 프로젝트 구조

```
src/main/java/com/studiopick/
├── StudioPickApplication.java
├── domain/
│   ├── user/          # 사용자 도메인
│   ├── studio/        # 스튜디오 도메인
│   ├── portfolio/     # 포트폴리오 도메인
│   ├── reservation/   # 예약 도메인
│   ├── review/        # 후기 도메인
│   └── auth/          # 인증 도메인
├── global/
│   ├── config/        # 설정
│   ├── security/      # 보안 (JWT)
│   ├── exception/     # 예외 처리
│   ├── response/      # 응답 형식
│   └── util/          # 유틸리티
└── infra/
    └── s3/            # S3 파일 업로드
```

## 환경 변수

### application-dev.yml (개발)
- H2 인메모리 DB 사용
- H2 Console: http://localhost:8080/h2-console

### application-prod.yml (운영)
- PostgreSQL 연결 필요
- AWS S3 설정 필요
- JWT Secret 환경변수 설정 필요

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/signup/user` - 일반 회원가입
- `POST /api/auth/signup/studio` - 기업 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 내 정보 조회

### 스튜디오 (Studio)
- `GET /api/studios` - 스튜디오 목록
- `GET /api/studios/{id}` - 스튜디오 상세
- `GET /api/studios/my` - 내 스튜디오
- `PUT /api/studios/{id}` - 스튜디오 수정
- `DELETE /api/studios/{id}` - 스튜디오 삭제

### 포트폴리오 (Portfolio)
- `GET /api/studios/{id}/portfolios` - 포트폴리오 목록
- `POST /api/studios/{id}/portfolios` - 포트폴리오 등록
- `DELETE /api/portfolios/{id}` - 포트폴리오 삭제

### 예약 (Reservation)
- `POST /api/reservations` - 예약 요청
- `GET /api/reservations/my` - 내 예약 목록
- `GET /api/reservations/studio` - 받은 예약 목록
- `PUT /api/reservations/{id}/approve` - 예약 승인
- `PUT /api/reservations/{id}/reject` - 예약 거절
- `PUT /api/reservations/{id}/complete` - 예약 완료
- `DELETE /api/reservations/{id}` - 예약 취소

### 후기 (Review)
- `POST /api/reviews` - 후기 작성
- `GET /api/studios/{id}/reviews` - 스튜디오 후기
- `GET /api/reviews/my` - 내 후기
- `PUT /api/reviews/{id}` - 후기 수정
- `DELETE /api/reviews/{id}` - 후기 삭제
