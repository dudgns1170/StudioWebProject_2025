import api from './axios'

export const studioApi = {
  // 스튜디오 목록 조회
  getStudios: (params) => api.get('/studios', { params }),
  
  // 스튜디오 상세 조회
  getStudio: (studioId) => api.get(`/studios/${studioId}`),
  
  // 스튜디오 등록 (기업회원)
  createStudio: (data) => api.post('/studios', data),
  
  // 스튜디오 수정 (기업회원)
  updateStudio: (studioId, data) => api.put(`/studios/${studioId}`, data),
  
  // 스튜디오 삭제 (기업회원)
  deleteStudio: (studioId) => api.delete(`/studios/${studioId}`),
  
  // 내 스튜디오 조회 (기업회원)
  getMyStudio: () => api.get('/studios/my'),
  
  // 포트폴리오 목록 조회
  getPortfolios: (studioId) => api.get(`/studios/${studioId}/portfolios`),
  
  // 포트폴리오 등록
  createPortfolio: (studioId, data) => api.post(`/studios/${studioId}/portfolios`, data),
  
  // 포트폴리오 삭제
  deletePortfolio: (portfolioId) => api.delete(`/portfolios/${portfolioId}`),
}
