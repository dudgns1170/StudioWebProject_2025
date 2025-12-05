import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { validationRules } from '../../utils/validators'

function StudioSignup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { signupStudio } = useAuth()

  const password = watch('password')

  const onSubmit = (data) => {
    const { confirmPassword, ...signupData } = data
    signupStudio(signupData)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            기업 회원가입
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="담당자 이름"
              placeholder="홍길동"
              {...register('name', validationRules.required('담당자 이름'))}
              error={errors.name?.message}
            />

            <Input
              label="이메일"
              type="email"
              placeholder="example@email.com"
              {...register('email', validationRules.email)}
              error={errors.email?.message}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="8자 이상, 영문+숫자+특수문자"
              {...register('password', validationRules.password)}
              error={errors.password?.message}
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...register('confirmPassword', {
                required: '비밀번호 확인을 입력해주세요',
                validate: (value) =>
                  value === password || '비밀번호가 일치하지 않습니다',
              })}
              error={errors.confirmPassword?.message}
            />

            <Input
              label="전화번호"
              placeholder="010-0000-0000"
              {...register('phone', validationRules.phone)}
              error={errors.phone?.message}
            />

            <Input
              label="사업자등록번호"
              placeholder="000-00-00000"
              {...register('businessNumber', validationRules.businessNumber)}
              error={errors.businessNumber?.message}
            />

            <Input
              label="스튜디오명"
              placeholder="스튜디오 이름"
              {...register('studioName', validationRules.required('스튜디오명'))}
              error={errors.studioName?.message}
            />

            <Button type="submit" fullWidth>
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary-600 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioSignup
