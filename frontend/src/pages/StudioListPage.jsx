import { useEffect, useState } from "react";
import { useStudios } from "../hooks/useStudio";
import StudioList from "../components/studio/StudioList";
import StudioMap from "../components/studio/StudioMap";
import InteractiveFilter from "../components/studio/InteractiveFilter";
import { useFilterStore } from "../store/filterStore";
import { motion } from "framer-motion";
import { FiMap, FiList, FiSearch } from "react-icons/fi";
import Loading from "../components/common/Loading";

function StudioListPage() {
  const { data, isLoading, error, refetch } = useStudios();
  const { page, nextPage, prevPage, resetFilters, filters } = useFilterStore();
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedStudio, setSelectedStudio] = useState(null);

  // 페이지 진입 시 필터 초기화
  useEffect(() => {
    resetFilters();
  }, []);

  const studios = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    refetch();
  };

  const handleStudioSelect = (studio) => {
    setSelectedStudio(studio);
    // Scroll to studio card in list view
    if (viewMode === "list") {
      const element = document.getElementById(`studio-${studio.id}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cool">
      {/* Header */}
      <div className="bg-white shadow-soft sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="heading-hero text-primary-900">스튜디오 찾기</h1>
              <p className="text-primary-600 mt-1">
                {studios.length}개의 스튜디오가 있습니다
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-primary-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-primary-900 shadow-soft"
                    : "text-primary-600 hover:text-primary-900"
                }`}
              >
                <FiList className="w-4 h-4" />
                <span className="hidden sm:inline">리스트</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === "map"
                    ? "bg-white text-primary-900 shadow-soft"
                    : "text-primary-600 hover:text-primary-900"
                }`}
              >
                <FiMap className="w-4 h-4" />
                <span className="hidden sm:inline">지도</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom section-padding">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <InteractiveFilter
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </aside>

          {/* Mobile Filter */}
          <div className="lg:hidden mb-6">
            <InteractiveFilter
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {viewMode === "list" ? (
              /* List View */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loading />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">
                      스튜디오를 불러오는데 실패했습니다.
                    </p>
                  </div>
                ) : studios.length > 0 ? (
                  <div>
                    <StudioList
                      studios={studios}
                      loading={isLoading}
                      error={error}
                      selectedStudio={selectedStudio}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 pt-8"
                      >
                        <button
                          onClick={prevPage}
                          disabled={page === 0}
                          className="btn btn-secondary disabled:opacity-50"
                        >
                          이전
                        </button>
                        <span className="text-primary-600 font-medium">
                          {page + 1} / {totalPages}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={page >= totalPages - 1}
                          className="btn btn-secondary disabled:opacity-50"
                        >
                          다음
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <FiSearch className="w-16 h-16 mx-auto text-primary-300 mb-4" />
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-primary-600">
                      필터 조건을 변경하거나 다른 지역을 검색해보세요.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Map View */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[calc(100vh-200px)] min-h-[600px]"
              >
                <StudioMap
                  studios={studios}
                  selectedStudio={selectedStudio}
                  onStudioSelect={handleStudioSelect}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioListPage;
