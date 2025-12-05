import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStudio, usePortfolios } from '../hooks/useStudio'
import { useAuthStore } from '../store/authStore'
import StudioInfo from '../components/studio/StudioInfo'
import PortfolioGallery from '../components/studio/PortfolioGallery'
import ReviewCard from '../components/review/ReviewCard'
import Loading from '../components/common/Loading'
import Button from '../components/common/Button'

function StudioDetailPage() {
  const { studioId } = useParams()
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('info')

  const { data: studioData, isLoading: studioLoading } = useStudio(studioId)
  const { data: portfolioData } = usePortfolios(studioId)

  const studio = studioData?.data
  const portfolios = portfolioData?.data || []

  if (studioLoading) {
    return <Loading fullScreen />
  }

  if (!studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">스튜디오를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'info', label: '정보' },
    { id: 'portfolio', label: '포트폴리오' },
    { id: 'reviews', label: `후기 (${studio.reviewCount || 0})` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Image */}
      <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
        <img
          src={studio.thumbnailUrl || '/placeholder-studio.jpg'}
          alt={studio.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && <StudioInfo studio={studio} />}
          {activeTab === 'portfolio' && <PortfolioGallery portfolios={portfolios} />}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {studio.reviews?.length > 0 ? (
                studio.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">
                  아직 후기가 없습니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Reservation CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">예약하기</h3>
            <p className="text-gray-600 mb-6">
              원하는 날짜와 시간에 촬영을 예약하세요.
            </p>
            {isAuthenticated ? (
              <Link to={`/reservation/${studioId}`}>
                <Button fullWidth>예약 페이지로 이동</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button fullWidth>로그인 후 예약하기</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioDetailPage
