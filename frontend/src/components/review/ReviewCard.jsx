import { FiStar } from 'react-icons/fi'
import { formatRelativeDate } from '../../utils/formatters'

function ReviewCard({ review }) {
  const { user, rating, content, images, createdAt } = review

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{formatRelativeDate(createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4">{content}</p>

      {/* Images */}
      {images && images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`후기 이미지 ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewCard
