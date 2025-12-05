import { useQuery } from '@tanstack/react-query'
import { useMyStudio } from '../../hooks/useStudio'
import { reviewApi } from '../../api/review.api'
import ReviewCard from '../../components/review/ReviewCard'
import Loading from '../../components/common/Loading'

function ReviewManage() {
  const { data: studioData } = useMyStudio()
  const studio = studioData?.data

  const { data, isLoading } = useQuery({
    queryKey: ['studioReviews', studio?.id],
    queryFn: () => reviewApi.getStudioReviews(studio?.id),
    enabled: !!studio?.id,
  })

  const reviews = data?.data || []

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">후기 관리</h1>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">평균 평점</p>
            <p className="text-3xl font-bold text-yellow-500">
              {studio?.rating?.toFixed(1) || '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">총 후기 수</p>
            <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 후기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default ReviewManage
