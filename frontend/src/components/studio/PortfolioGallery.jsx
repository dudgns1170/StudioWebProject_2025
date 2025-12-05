import { useState } from 'react'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function PortfolioGallery({ portfolios }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const openLightbox = (index) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)

  const goToPrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? portfolios.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev === portfolios.length - 1 ? 0 : prev + 1
    )
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        등록된 포트폴리오가 없습니다.
      </div>
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolios.map((portfolio, index) => (
          <div
            key={portfolio.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img
              src={portfolio.imageUrl}
              alt={portfolio.title || `포트폴리오 ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiX className="w-8 h-8" />
          </button>

          {/* Prev Button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <img
            src={portfolios[selectedIndex].imageUrl}
            alt={portfolios[selectedIndex].title}
            className="max-w-full max-h-[90vh] object-contain"
          />

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiChevronRight className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedIndex + 1} / {portfolios.length}
          </div>
        </div>
      )}
    </>
  )
}

export default PortfolioGallery
