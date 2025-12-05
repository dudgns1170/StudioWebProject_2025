import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

// 가격 포맷팅 (원화)
export const formatPrice = (price) => {
  if (!price && price !== 0) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price)
}

// 가격 포맷팅 (숫자만)
export const formatNumber = (num) => {
  if (!num && num !== 0) return '-'
  return new Intl.NumberFormat('ko-KR').format(num)
}

// 날짜 포맷팅
export const formatDate = (date, formatStr = 'yyyy.MM.dd') => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: ko })
}

// 날짜 + 시간 포맷팅
export const formatDateTime = (date) => {
  return formatDate(date, 'yyyy.MM.dd HH:mm')
}

// 상대적 날짜 (오늘, 어제 등)
export const formatRelativeDate = (date) => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diff = now - dateObj
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '오늘'
  if (days === 1) return '어제'
  if (days < 7) return `${days}일 전`
  if (days < 30) return `${Math.floor(days / 7)}주 전`
  if (days < 365) return `${Math.floor(days / 30)}개월 전`
  return `${Math.floor(days / 365)}년 전`
}

// 전화번호 포맷팅
export const formatPhone = (phone) => {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  return phone
}

// 별점 포맷팅
export const formatRating = (rating) => {
  if (!rating && rating !== 0) return '-'
  return rating.toFixed(1)
}
