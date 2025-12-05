// 이메일 유효성 검사
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// 비밀번호 유효성 검사 (8자 이상, 영문+숫자+특수문자)
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return regex.test(password)
}

// 전화번호 유효성 검사
export const validatePhone = (phone) => {
  const regex = /^01[0-9]-?\d{3,4}-?\d{4}$/
  return regex.test(phone)
}

// 사업자등록번호 유효성 검사
export const validateBusinessNumber = (number) => {
  const regex = /^\d{3}-?\d{2}-?\d{5}$/
  return regex.test(number)
}

// 필수값 검사
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

// 최소 길이 검사
export const minLength = (value, min) => {
  return value && value.length >= min
}

// 최대 길이 검사
export const maxLength = (value, max) => {
  return !value || value.length <= max
}

// 숫자 범위 검사
export const inRange = (value, min, max) => {
  const num = Number(value)
  return !isNaN(num) && num >= min && num <= max
}

// React Hook Form용 validation rules
export const validationRules = {
  email: {
    required: '이메일을 입력해주세요',
    validate: (value) => validateEmail(value) || '올바른 이메일 형식이 아닙니다',
  },
  password: {
    required: '비밀번호를 입력해주세요',
    validate: (value) =>
      validatePassword(value) ||
      '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다',
  },
  phone: {
    required: '전화번호를 입력해주세요',
    validate: (value) => validatePhone(value) || '올바른 전화번호 형식이 아닙니다',
  },
  businessNumber: {
    required: '사업자등록번호를 입력해주세요',
    validate: (value) =>
      validateBusinessNumber(value) || '올바른 사업자등록번호 형식이 아닙니다',
  },
  required: (fieldName) => ({
    required: `${fieldName}을(를) 입력해주세요`,
  }),
}
