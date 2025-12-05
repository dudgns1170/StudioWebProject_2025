import { useState } from 'react'
import {
  useStudioReservations,
  useApproveReservation,
  useRejectReservation,
  useCompleteReservation,
} from '../../hooks/useReservation'
import ReservationCard from '../../components/reservation/ReservationCard'
import Loading from '../../components/common/Loading'
import { RESERVATION_STATUS } from '../../utils/constants'

function ReservationManage() {
  const [filter, setFilter] = useState('all')
  const { data, isLoading } = useStudioReservations()

  const approveReservation = useApproveReservation()
  const rejectReservation = useRejectReservation()
  const completeReservation = useCompleteReservation()

  const reservations = data?.data || []

  const filteredReservations =
    filter === 'all'
      ? reservations
      : reservations.filter((r) => r.status === filter)

  const handleAction = (action, reservationId) => {
    switch (action) {
      case 'approve':
        approveReservation.mutate(reservationId)
        break
      case 'reject':
        if (confirm('예약을 거절하시겠습니까?')) {
          rejectReservation.mutate(reservationId)
        }
        break
      case 'complete':
        completeReservation.mutate(reservationId)
        break
    }
  }

  if (isLoading) {
    return <Loading />
  }

  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'PENDING', label: '대기중' },
    { value: 'APPROVED', label: '승인됨' },
    { value: 'COMPLETED', label: '완료' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">예약 관리</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              isStudioOwner
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">예약이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default ReservationManage
