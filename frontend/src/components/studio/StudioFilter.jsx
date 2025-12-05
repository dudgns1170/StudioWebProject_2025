import { useFilterStore } from '../../store/filterStore'
import { SHOOTING_TYPES, CITIES, SORT_OPTIONS } from '../../utils/constants'
import Button from '../common/Button'

function StudioFilter() {
  const { filters, setFilter, resetFilters } = useFilterStore()

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">필터</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-primary-600 hover:underline"
        >
          초기화
        </button>
      </div>

      {/* 지역 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          지역
        </label>
        <select
          value={filters.city}
          onChange={(e) => setFilter('city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">전체</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 촬영 종류 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          촬영 종류
        </label>
        <select
          value={filters.shootingType}
          onChange={(e) => setFilter('shootingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">전체</option>
          {Object.entries(SHOOTING_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 가격 범위 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          가격 범위
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="최소"
            value={filters.minPrice}
            onChange={(e) => setFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-400">~</span>
          <input
            type="number"
            placeholder="최대"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* 정렬 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          정렬
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default StudioFilter
