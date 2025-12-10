import { Link } from 'react-router-dom'
import { FiSearch, FiCamera, FiCalendar, FiStar, FiArrowRight } from 'react-icons/fi'
import Button from '../components/common/Button'
import StudioCard from '../components/studio/StudioCard'
import { useStudios } from '../hooks/useStudio'
import Loading from '../components/common/Loading'

function Home() {
  // 인기 스튜디오 목록 (최신 3개)
  const { data: studiosData, isLoading } = useStudios({ size: 3 })
  const popularStudios = studiosData?.data?.content || []

  const features = [
    {
      icon: FiSearch,
      title: '스튜디오 찾기',
      description: '지역, 촬영 종류, 가격대로 원하는 스튜디오를 찾아보세요.',
      link: '/studios',
      linkText: '스튜디오 검색하기',
    },
    {
      icon: FiCamera,
      title: '포트폴리오 확인',
      description: '스튜디오의 실제 촬영 결과물을 미리 확인하세요.',
      link: '/studios?tab=portfolio',
      linkText: '포트폴리오 보기',
    },
    {
      icon: FiCalendar,
      title: '간편 예약',
      description: '원하는 날짜와 시간에 바로 예약하세요.',
      link: '/studios?action=reserve',
      linkText: '예약하러 가기',
    },
    {
      icon: FiStar,
      title: '실제 후기',
      description: '다른 고객들의 솔직한 후기를 확인하세요.',
      link: '/studios?tab=reviews',
      linkText: '후기 확인하기',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              특별한 순간을 담을<br />
              완벽한 스튜디오를 찾아보세요
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              바디프로필, 증명사진, 가족사진, 커플사진까지<br />
              다양한 스튜디오를 한 곳에서 비교하고 예약하세요.
            </p>
            <Link to="/studios">
              <Button size="lg" variant="secondary">
                스튜디오 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            StudioPick이 특별한 이유
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <span className="text-primary-600 font-medium flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  {feature.linkText}
                  <FiArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Studios Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              인기 스튜디오
            </h2>
            <Link 
              to="/studios" 
              className="text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              전체보기
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : popularStudios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularStudios.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              등록된 스튜디오가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              스튜디오를 운영하고 계신가요?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              StudioPick에 스튜디오를 등록하고 더 많은 고객을 만나보세요.
              간편한 예약 관리와 고객 관리 기능을 제공합니다.
            </p>
            <Link to="/signup/studio">
              <Button size="lg">스튜디오 등록하기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
