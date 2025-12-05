import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMyStudio, useUpdateStudio } from '../../hooks/useStudio'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import { SHOOTING_TYPES, CITIES } from '../../utils/constants'

function StudioManage() {
  const { data, isLoading } = useMyStudio()
  const updateStudio = useUpdateStudio()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const studio = data?.data

  useEffect(() => {
    if (studio) {
      reset(studio)
    }
  }, [studio, reset])

  const onSubmit = (formData) => {
    updateStudio.mutate({
      studioId: studio.id,
      data: formData,
    })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">스튜디오 정보 관리</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="스튜디오명"
            {...register('name', { required: '스튜디오명을 입력해주세요' })}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              소개
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="스튜디오를 소개해주세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지역
            </label>
            <select
              {...register('city')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">선택하세요</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="상세 주소"
            {...register('address')}
            placeholder="상세 주소를 입력하세요"
          />

          <Input
            label="전화번호"
            {...register('phone')}
            placeholder="010-0000-0000"
          />

          <Input
            label="운영 시간"
            {...register('operatingHours')}
            placeholder="예: 10:00 - 19:00"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              촬영 종류
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SHOOTING_TYPES).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={key}
                    {...register('shootingTypes')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={updateStudio.isPending}
          >
            저장하기
          </Button>
        </form>
      </div>
    </div>
  )
}

export default StudioManage
