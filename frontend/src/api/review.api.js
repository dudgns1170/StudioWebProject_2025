import api from './axios'

export const reviewApi = {
  // 후기 작성 (일반회원)
  createReview: (data) => api.post('/reviews', data).then(res => res.data),
  
  // 스튜디오 후기 목록
  getStudioReviews: (studioId) => api.get(`/studios/${studioId}/reviews`).then(res => res.data),
  
  // 내가 쓴 후기
  getMyReviews: () => api.get('/reviews/my').then(res => res.data),
  
  // 후기 수정
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data).then(res => res.data),
  
  // 후기 삭제
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`).then(res => res.data),
}
