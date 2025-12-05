import { useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useMyStudio, usePortfolios, useCreatePortfolio, useDeletePortfolio } from '../../hooks/useStudio'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loading from '../../components/common/Loading'

function PortfolioManage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const { data: studioData } = useMyStudio()
  const studio = studioData?.data

  const { data: portfolioData, isLoading } = usePortfolios(studio?.id)
  const createPortfolio = useCreatePortfolio()
  const deletePortfolio = useDeletePortfolio()

  const portfolios = portfolioData?.data || []

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = () => {
    if (selectedFile && studio) {
      const formData = new FormData()
      formData.append('image', selectedFile)

      createPortfolio.mutate(
        { studioId: studio.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedFile(null)
            setPreview(null)
          },
        }
      )
    }
  }

  const handleDelete = (portfolioId) => {
    if (confirm('포트폴리오를 삭제하시겠습니까?')) {
      deletePortfolio.mutate(portfolioId)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <FiPlus className="w-5 h-5 mr-1" />
          추가
        </Button>
      </div>

      {/* Portfolio Grid */}
      {portfolios.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="relative group">
              <img
                src={portfolio.imageUrl}
                alt="포트폴리오"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(portfolio.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">등록된 포트폴리오가 없습니다.</p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="포트폴리오 추가"
      >
        <div className="space-y-4">
          {preview ? (
            <img
              src={preview}
              alt="미리보기"
              className="w-full aspect-square object-cover rounded-lg"
            />
          ) : (
            <label className="block w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500">
              <div className="text-center">
                <FiPlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">이미지를 선택하세요</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={handleUpload}
              disabled={!selectedFile}
              loading={createPortfolio.isPending}
            >
              업로드
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PortfolioManage
