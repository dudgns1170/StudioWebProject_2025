import api from './axios'

export const authApi = {
  // 일반 회원가입
  signupUser: (data) => api.post('/auth/signup/user', data),
  
  // 기업 회원가입
  signupStudio: (data) => api.post('/auth/signup/studio', data),
  
  // 로그인
  login: (data) => api.post('/auth/login', data),
  
  // 로그아웃
  logout: () => api.post('/auth/logout'),
  
  // 토큰 갱신
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // 내 정보 조회
  getMe: () => api.get('/auth/me'),
}
