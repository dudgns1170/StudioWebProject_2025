import { Link } from 'react-router-dom'
import { FiUser, FiCamera } from 'react-icons/fi'

function SignupSelect() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          회원가입
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Signup */}
          <Link
            to="/signup/user"
            className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
              <FiUser className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              일반 회원가입
            </h2>
            <p className="text-gray-600">
              스튜디오를 검색하고 예약하고 싶으신 분
            </p>
          </Link>

          {/* Studio Signup */}
          <Link
            to="/signup/studio"
            className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
              <FiCamera className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              기업 회원가입
            </h2>
            <p className="text-gray-600">
              스튜디오를 운영하고 등록하고 싶으신 분
            </p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupSelect
