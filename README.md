# StudioPick - 스튜디오 예약 플랫폼

스튜디오 촬영 예약을 위한 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
studio-booking-platform/
├── frontend/          # React 프론트엔드
├── backend/           # Spring Boot 백엔드
└── README.md
```

## 기술 스택

### Frontend
- React 18
- React Router DOM 6
- TailwindCSS
- Zustand (상태 관리)
- React Query (서버 상태)
- Axios
- React Hook Form

### Backend
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- AWS S3 (파일 업로드)
- Swagger (API 문서)

## 시작하기

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
./gradlew bootRun
```

## 주요 기능

- **회원 관리**: 일반 회원 / 기업 회원 가입 및 로그인
- **스튜디오 조회**: 필터링, 정렬, 검색
- **예약 시스템**: 예약 요청, 승인/거절, 완료
- **후기 시스템**: 별점 및 이미지 후기
- **포트폴리오 관리**: 스튜디오 포트폴리오 업로드

## API 문서

백엔드 실행 후 Swagger UI 접속:
- http://localhost:8080/swagger-ui.html

## 환경 변수

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_KAKAO_MAP_KEY=your_kakao_map_key
```

### Backend (application.yml)
- PostgreSQL 연결 정보
- JWT Secret Key
- AWS S3 설정

## Git 브랜치 전략

```
main           # 운영 환경
  └── develop  # 개발 환경
       ├── feature/auth
       ├── feature/studio
       ├── feature/reservation
       └── feature/review
```
