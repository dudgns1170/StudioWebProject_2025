import { useMyReservations, useCancelReservation } from '../../hooks/useReservation'
import ReservationCard from '../../components/reservation/ReservationCard'
import Loading from '../../components/common/Loading'

function MyReservations() {
  const { data, isLoading } = useMyReservations()
  const cancelReservation = useCancelReservation()

  const reservations = data?.data || []

  const handleAction = (action, reservationId) => {
    if (action === 'cancel') {
      if (confirm('예약을 취소하시겠습니까?')) {
        cancelReservation.mutate(reservationId)
      }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">내 예약</h1>

      {reservations.length > 0 ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">예약 내역이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default MyReservations
