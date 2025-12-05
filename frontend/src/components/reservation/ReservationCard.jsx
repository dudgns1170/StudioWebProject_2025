import { Link } from 'react-router-dom'
import { formatDate, formatPrice } from '../../utils/formatters'
import { RESERVATION_STATUS, RESERVATION_STATUS_COLORS } from '../../utils/constants'
import Button from '../common/Button'

function ReservationCard({ reservation, isStudioOwner = false, onAction }) {
  const {
    id,
    studio,
    date,
    time,
    packageName,
    price,
    status,
    userName,
    userPhone,
  } = reservation

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Link
              to={`/studios/${studio?.id}`}
              className="font-semibold text-lg hover:text-primary-600"
            >
              {studio?.name}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(date)} {time}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${RESERVATION_STATUS_COLORS[status]}`}
          >
            {RESERVATION_STATUS[status]}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">패키지</span>
            <span className="font-medium">{packageName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">가격</span>
            <span className="font-medium">{formatPrice(price)}</span>
          </div>
          {isStudioOwner && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">예약자</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">연락처</span>
                <span className="font-medium">{userPhone}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {status === 'PENDING' && (
          <div className="flex gap-2">
            {isStudioOwner ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAction?.('approve', id)}
                  className="flex-1"
                >
                  승인
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onAction?.('reject', id)}
                  className="flex-1"
                >
                  거절
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction?.('cancel', id)}
                fullWidth
              >
                예약 취소
              </Button>
            )}
          </div>
        )}

        {status === 'APPROVED' && isStudioOwner && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAction?.('complete', id)}
            fullWidth
          >
            촬영 완료
          </Button>
        )}
      </div>
    </div>
  )
}

export default ReservationCard
