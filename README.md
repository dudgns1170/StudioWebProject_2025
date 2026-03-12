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

## 환경 변수 설정

### Backend (.env)

백엔드 루트에 `.env` 파일 생성 (`.env.example` 참고):

```bash
cd backend
cp .env.example .env
```

**최소 필수 설정:**
```env
JWT_SECRET=your-secret-key-min-256-bits
```

### Frontend (.env)

프론트엔드 루트에 `.env` 파일 생성 (`.env.example` 참고):

```bash
cd frontend
cp .env.example .env
```

**기본 설정:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_KAKAO_MAP_KEY=your_kakao_map_key  # 선택사항
```

## 테스트 계정

애플리케이션 실행 시 자동으로 생성되는 테스트 계정:

### 일반 회원
- user1@example.com / test1234
- user2@example.com / test1234

### 기업 회원 (스튜디오)
- studio1@example.com / test1234 (스냅스튜디오)
- studio2@example.com / test1234 (포토라운지)
- studio3@example.com / test1234 (프레임스튜디오)

## 개발 도구

- **Swagger UI**: http://localhost:8080/swagger-ui.html (API 문서)
- **H2 Console**: http://localhost:8080/h2-console (개발용 DB)

## 보안 주의사항

### 개발 환경
- H2 Console이 활성화되어 있습니다
- 기본 JWT Secret Key 사용 중
- CORS가 localhost:3000, localhost:5173에 열려있습니다

### 운영 환경 배포 전 체크리스트
- [ ] JWT_SECRET 환경변수로 안전한 키 설정
- [ ] SecurityConfig에서 `/h2-console/**` 접근 제거
- [ ] CORS 설정을 실제 프론트엔드 도메인으로 변경
- [ ] AWS S3 자격증명을 IAM Role 또는 환경변수로 관리
- [ ] PostgreSQL로 데이터베이스 전환 (application-prod.yml)

## Git 브랜치 전략

```
main           # 운영 환경
  └── develop  # 개발 환경
       ├── feature/auth
       ├── feature/studio
       ├── feature/reservation
       └── feature/review
```
