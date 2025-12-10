import { useParams, useNavigate } from 'react-router-dom'
import { useStudio } from '../hooks/useStudio'
import ReservationForm from '../components/reservation/ReservationForm'
import Loading from '../components/common/Loading'

function ReservationPage() {
  const { studioId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useStudio(studioId)

  const studio = data?.data

  if (isLoading) {
    return <Loading fullScreen />
  }

  if (!studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">스튜디오를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleSuccess = () => {
    navigate('/mypage/reservations')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">예약하기</h1>
      <p className="text-gray-600 mb-8">{studio.name}</p>

      <div className="bg-white rounded-xl shadow-md p-6">
        <ReservationForm
          studioId={studioId}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}

export default ReservationPage
