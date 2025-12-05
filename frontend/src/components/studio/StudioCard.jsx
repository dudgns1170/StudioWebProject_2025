import { Link } from 'react-router-dom'
import { FiStar, FiMapPin } from 'react-icons/fi'
import { formatPrice, formatRating } from '../../utils/formatters'
import { SHOOTING_TYPES } from '../../utils/constants'

function StudioCard({ studio }) {
  const {
    id,
    name,
    thumbnailUrl,
    city,
    shootingTypes,
    minPrice,
    rating,
    reviewCount,
  } = studio

  return (
    <Link to={`/studios/${id}`} className="card group">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={thumbnailUrl || '/placeholder-studio.jpg'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span>{city}</span>
        </div>

        {/* Shooting Types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {shootingTypes?.slice(0, 3).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {SHOOTING_TYPES[type] || type}
            </span>
          ))}
          {shootingTypes?.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{shootingTypes.length - 3}
            </span>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary-600">
            {formatPrice(minPrice)}~
          </span>
          <div className="flex items-center text-sm">
            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium">{formatRating(rating)}</span>
            <span className="text-gray-400 ml-1">({reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StudioCard
