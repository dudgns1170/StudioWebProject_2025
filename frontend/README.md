# StudioPick Frontend

React + Vite 기반 스튜디오 예약 플랫폼 프론트엔드입니다.

## 기술 스택

- React 18
- Vite
- React Router DOM 6
- TailwindCSS
- Zustand (상태 관리)
- React Query (서버 상태)
- Axios
- React Hook Form
- date-fns

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── api/                    # API 통신
│   ├── axios.js
│   ├── auth.api.js
│   ├── studio.api.js
│   ├── reservation.api.js
│   └── review.api.js
│
├── components/             # 재사용 컴포넌트
│   ├── common/
│   ├── studio/
│   ├── reservation/
│   └── review/
│
├── pages/                  # 페이지 컴포넌트
│   ├── Home.jsx
│   ├── StudioListPage.jsx
│   ├── StudioDetailPage.jsx
│   ├── ReservationPage.jsx
│   ├── auth/
│   ├── user/
│   └── studio/
│
├── hooks/                  # 커스텀 훅
│   ├── useAuth.js
│   ├── useStudio.js
│   └── useReservation.js
│
├── store/                  # 상태 관리 (Zustand)
│   ├── authStore.js
│   ├── studioStore.js
│   └── filterStore.js
│
├── utils/                  # 유틸리티 함수
│   ├── constants.js
│   ├── formatters.js
│   └── validators.js
│
├── styles/
│   └── index.css
│
├── App.jsx
├── index.jsx
└── routes.jsx
```

## 환경 변수

`.env` 파일 설정:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_KAKAO_MAP_KEY=your_kakao_map_key
```

## 주요 페이지

- `/` - 메인 페이지
- `/studios` - 스튜디오 목록
- `/studios/:id` - 스튜디오 상세
- `/login` - 로그인
- `/signup` - 회원가입 선택
- `/signup/user` - 일반 회원가입
- `/signup/studio` - 기업 회원가입
- `/mypage` - 마이페이지
- `/mypage/reservations` - 내 예약
- `/mypage/reviews` - 내 후기
- `/studio/dashboard` - 스튜디오 대시보드
- `/studio/manage` - 스튜디오 정보 관리
- `/studio/portfolio` - 포트폴리오 관리
- `/studio/reservations` - 예약 관리
- `/studio/reviews` - 후기 관리
