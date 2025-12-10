import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { useCreateReservation } from '../../hooks/useReservation'
import Button from '../common/Button'
import DatePicker from './DatePicker'
import { SHOOTING_TYPES } from '../../utils/constants'

function ReservationForm({ studioId, onSuccess }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm()
  const createReservation = useCreateReservation()

  const selectedDate = watch('date')

  const onSubmit = (data) => {
    if (!selectedDate) {
      alert('예약 날짜를 선택해주세요.')
      return
    }

    // 백엔드 API 형식에 맞게 데이터 변환 (yyyy-MM-dd)
    const reservationData = {
      studioId: Number(studioId),
      preferredDate: format(selectedDate, 'yyyy-MM-dd'),
      preferredTime: data.time,
      shootingType: data.shootingType,
      options: null,
      message: data.message || null,
    }

    createReservation.mutate(reservationData, {
      onSuccess: () => {
        alert('예약 요청이 완료되었습니다!')
        onSuccess?.()
      },
      onError: (error) => {
        alert(error.response?.data?.message || '예약 요청에 실패했습니다.')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 날짜 {selectedDate && (
            <span className="text-primary-600 font-normal">
              - {format(selectedDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
            </span>
          )}
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setValue('date', date)}
        />
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          희망 시간대
        </label>
        <select
          {...register('time', { required: '시간대를 선택해주세요' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">시간대 선택</option>
          <option value="오전">오전 (09:00 ~ 12:00)</option>
          <option value="오후">오후 (13:00 ~ 18:00)</option>
          <option value="저녁">저녁 (18:00 ~ 21:00)</option>
        </select>
        {errors.time && (
          <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
        )}
      </div>

      {/* Shooting Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          촬영 종류
        </label>
        <select
          {...register('shootingType', { required: '촬영 종류를 선택해주세요' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">촬영 종류 선택</option>
          {Object.entries(SHOOTING_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {errors.shootingType && (
          <p className="mt-1 text-sm text-red-500">{errors.shootingType.message}</p>
        )}
      </div>

      {/* Request Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          요청사항
        </label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="촬영 관련 요청사항을 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        loading={createReservation.isPending}
      >
        예약 요청하기
      </Button>
    </form>
  )
}

export default ReservationForm
