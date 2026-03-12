import api from './axios'

export const paymentApi = {
  // 결제 준비 (예약 생성 및 orderId 발급)
  prepareDeposit: (data) => api.post('/reservations/payments/deposit/prepare', data).then(res => res.data),
  
  // 결제 승인 (paymentKey로 결제 확인)
  confirmDeposit: (data) => api.post('/reservations/payments/deposit/confirm', data).then(res => res.data),
  
  // 결제 취소
  cancelPayment: (paymentKey, reason) => api.post(`/payments/${paymentKey}/cancel`, { reason }).then(res => res.data),
  
  // 결제 조회
  getPayment: (paymentKey) => api.get(`/payments/${paymentKey}`).then(res => res.data),
}
