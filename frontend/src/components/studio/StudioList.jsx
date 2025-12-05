import StudioCard from './StudioCard'
import Loading from '../common/Loading'

function StudioList({ studios, loading, error }) {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">스튜디오를 불러오는데 실패했습니다.</p>
      </div>
    )
  }

  if (!studios || studios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  )
}

export default StudioList
