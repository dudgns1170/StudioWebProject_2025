import { Link } from 'react-router-dom'
import { FiCamera, FiCalendar, FiStar, FiSettings, FiImage } from 'react-icons/fi'
import { useMyStudio } from '../../hooks/useStudio'
import { useStudioReservations } from '../../hooks/useReservation'
import Loading from '../../components/common/Loading'

function StudioDashboard() {
  const { data: studioData, isLoading: studioLoading } = useMyStudio()
  const { data: reservationsData } = useStudioReservations()

  const studio = studioData?.data
  const reservations = reservationsData?.data || []

  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length
  const todayCount = reservations.filter((r) => {
    const today = new Date().toISOString().split('T')[0]
    return r.date === today && r.status === 'APPROVED'
  }).length

  if (studioLoading) {
    return <Loading />
  }

  const menuItems = [
    {
      icon: FiSettings,
      title: '스튜디오 정보 관리',
      description: '기본 정보를 수정하세요',
      link: '/studio/manage',
      count: null,
    },
    {
      icon: FiImage,
      title: '포트폴리오 관리',
      description: '촬영 결과물을 업로드하세요',
      link: '/studio/portfolio',
      count: null,
    },
    {
      icon: FiCalendar,
      title: '예약 관리',
      description: '예약 요청을 확인하세요',
      link: '/studio/reservations',
      count: pendingCount,
    },
    {
      icon: FiStar,
      title: '후기 관리',
      description: '고객 후기를 확인하세요',
      link: '/studio/reviews',
      count: null,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <FiCamera className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {studio?.name || '스튜디오'}
            </h1>
            <p className="text-gray-500">스튜디오 관리 대시보드</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">대기 중인 예약</p>
          <p className="text-3xl font-bold text-primary-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">오늘 촬영</p>
          <p className="text-3xl font-bold text-gray-900">{todayCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">평균 평점</p>
          <p className="text-3xl font-bold text-yellow-500">
            {studio?.rating?.toFixed(1) || '-'}
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.count > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default StudioDashboard
