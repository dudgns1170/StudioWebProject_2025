import api from './axios'

export const reservationApi = {
  // 예약 요청 (일반회원)
  createReservation: (data) => api.post('/reservations', data).then(res => res.data),
  
  // 내 예약 목록 (일반회원)
  getMyReservations: () => api.get('/reservations/my').then(res => res.data),
  
  // 받은 예약 목록 (기업회원)
  getStudioReservations: () => api.get('/reservations/studio').then(res => res.data),
  
  // 예약 상세
  getReservation: (reservationId) => api.get(`/reservations/${reservationId}`).then(res => res.data),
  
  // 예약 승인 (기업회원)
  approveReservation: (reservationId) => api.put(`/reservations/${reservationId}/approve`).then(res => res.data),
  
  // 예약 거절 (기업회원)
  rejectReservation: (reservationId) => api.put(`/reservations/${reservationId}/reject`).then(res => res.data),
  
  // 예약 완료 (기업회원)
  completeReservation: (reservationId) => api.put(`/reservations/${reservationId}/complete`).then(res => res.data),
  
  // 예약 취소
  cancelReservation: (reservationId) => api.delete(`/reservations/${reservationId}`).then(res => res.data),
}
