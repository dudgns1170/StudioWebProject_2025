// 촬영 종류
export const SHOOTING_TYPES = {
  BODY_PROFILE: '바디프로필',
  PORTRAIT: '증명/프로필',
  FAMILY: '가족사진',
  COUPLE: '커플사진',
  WEDDING: '웨딩',
  GRADUATION: '졸업사진',
  PET: '반려동물',
  COMMERCIAL: '상업/제품',
}

// 예약 상태
export const RESERVATION_STATUS = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
}

// 예약 상태 색상
export const RESERVATION_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'priceAsc', label: '가격 낮은순' },
  { value: 'priceDesc', label: '가격 높은순' },
]

// 지역 목록 (경기도 중심)
export const CITIES = [
  '수원시',
  '성남시',
  '용인시',
  '안양시',
  '부천시',
  '고양시',
  '화성시',
  '평택시',
  '안산시',
  '남양주시',
  '의정부시',
  '시흥시',
  '파주시',
  '김포시',
  '광명시',
  '광주시',
  '군포시',
  '하남시',
  '오산시',
  '이천시',
]

// 사용자 역할
export const USER_ROLES = {
  USER: 'USER',
  STUDIO: 'STUDIO',
  ADMIN: 'ADMIN',
}
