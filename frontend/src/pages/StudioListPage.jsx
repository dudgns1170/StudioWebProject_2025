import { useStudios } from '../hooks/useStudio'
import StudioList from '../components/studio/StudioList'
import StudioFilter from '../components/studio/StudioFilter'
import { useFilterStore } from '../store/filterStore'
import Button from '../components/common/Button'

function StudioListPage() {
  const { data, isLoading, error } = useStudios()
  const { page, nextPage, prevPage } = useFilterStore()

  const studios = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">스튜디오 찾기</h1>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-8">
            <StudioFilter />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <StudioList
            studios={studios}
            loading={isLoading}
            error={error}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={page === 0}
              >
                이전
              </Button>
              <span className="text-gray-600">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={page >= totalPages - 1}
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudioListPage
