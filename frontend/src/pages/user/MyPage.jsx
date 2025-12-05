import { Link } from 'react-router-dom'
import { FiCalendar, FiStar, FiUser, FiSettings } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'

function MyPage() {
  const { user } = useAuthStore()

  const menuItems = [
    {
      icon: FiCalendar,
      title: '내 예약',
      description: '예약 내역을 확인하세요',
      link: '/mypage/reservations',
    },
    {
      icon: FiStar,
      title: '내 후기',
      description: '작성한 후기를 관리하세요',
      link: '/mypage/reviews',
    },
    {
      icon: FiSettings,
      title: '계정 설정',
      description: '개인정보를 수정하세요',
      link: '/mypage/settings',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <item.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MyPage
