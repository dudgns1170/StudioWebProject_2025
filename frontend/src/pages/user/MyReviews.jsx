import { useQuery } from '@tanstack/react-query'
import { reviewApi } from '../../api/review.api'
import ReviewCard from '../../components/review/ReviewCard'
import Loading from '../../components/common/Loading'

function MyReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['myReviews'],
    queryFn: reviewApi.getMyReviews,
  })

  const reviews = data?.data || []

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">내 후기</h1>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">작성한 후기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default MyReviews
