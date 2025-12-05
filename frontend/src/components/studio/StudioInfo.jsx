import { FiMapPin, FiPhone, FiClock, FiStar } from 'react-icons/fi'
import { formatPrice, formatRating, formatPhone } from '../../utils/formatters'
import { SHOOTING_TYPES } from '../../utils/constants'

function StudioInfo({ studio }) {
  const {
    name,
    description,
    address,
    phone,
    operatingHours,
    shootingTypes,
    priceInfo,
    rating,
    reviewCount,
  } = studio

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium text-gray-900">
              {formatRating(rating)}
            </span>
            <span className="ml-1">({reviewCount}개 후기)</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">소개</h3>
        <p className="text-gray-600 whitespace-pre-line">{description}</p>
      </div>

      {/* Shooting Types */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">촬영 종류</h3>
        <div className="flex flex-wrap gap-2">
          {shootingTypes?.map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
            >
              {SHOOTING_TYPES[type] || type}
            </span>
          ))}
        </div>
      </div>

      {/* Price Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">가격 정보</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {priceInfo?.map((price, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <span className="text-gray-600">{price.name}</span>
              <span className="font-semibold">{formatPrice(price.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <span className="text-gray-600">{address}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiPhone className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">{formatPhone(phone)}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiClock className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">{operatingHours}</span>
        </div>
      </div>
    </div>
  )
}

export default StudioInfo
