import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { validationRules } from '../../utils/validators'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, loginLoading, loginError } = useAuth()

  const onSubmit = (data) => {
    login(data)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            로그인
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="비밀번호를 입력하세요"
              {...register('password', { required: '비밀번호를 입력해주세요' })}
              error={errors.password?.message}
            />

            {loginError && (
              <p className="text-sm text-red-500 text-center">
                이메일 또는 비밀번호가 올바르지 않습니다.
              </p>
            )}

            <Button type="submit" fullWidth loading={loginLoading}>
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" className="text-primary-600 hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
