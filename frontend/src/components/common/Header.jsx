import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

function Header() {
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()
  const isStudioOwner = user?.role === 'STUDIO'

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">StudioPick</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/studios" className="text-gray-600 hover:text-primary-600 transition-colors">
              스튜디오 찾기
            </Link>
            {isAuthenticated && isStudioOwner && (
              <Link to="/studio/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                스튜디오 관리
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={isStudioOwner ? '/studio/dashboard' : '/mypage'}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {user?.name || '마이페이지'}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  로그인
                </Link>
                <Link to="/signup" className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
