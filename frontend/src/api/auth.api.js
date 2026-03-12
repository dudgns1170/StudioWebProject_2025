import api from './axios'

export const authApi = {
  // 일반 회원가입
  signupUser: (data) => api.post('/auth/signup/user', data).then(res => res.data),
  
  // 기업 회원가입
  signupStudio: (data) => api.post('/auth/signup/studio', data).then(res => res.data),
  
  // 로그인
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  
  // 로그아웃
  logout: () => api.post('/auth/logout').then(res => res.data),
  
  // 토큰 갱신
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }).then(res => res.data),
  
  // 내 정보 조회
  getMe: () => api.get('/auth/me').then(res => res.data),
}
