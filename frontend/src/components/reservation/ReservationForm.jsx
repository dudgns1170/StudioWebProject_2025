import { useForm } from 'react-hook-form'
import { useCreateReservation } from '../../hooks/useReservation'
import Button from '../common/Button'
import Input from '../common/Input'
import DatePicker from './DatePicker'

function ReservationForm({ studioId, priceInfo, onSuccess }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm()
  const createReservation = useCreateReservation()

  const selectedDate = watch('date')
  const selectedTime = watch('time')
  const selectedPackage = watch('packageId')

  const onSubmit = (data) => {
    createReservation.mutate(
      {
        studioId,
        ...data,
      },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 날짜
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setValue('date', date)}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 시간
        </label>
        <select
          {...register('time', { required: '시간을 선택해주세요' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">시간 선택</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
        </select>
        {errors.time && (
          <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
        )}
      </div>

      {/* Package Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          촬영 패키지
        </label>
        <div className="space-y-2">
          {priceInfo?.map((pkg) => (
            <label
              key={pkg.id}
              className={`
                flex items-center justify-between p-4 border rounded-lg cursor-pointer
                ${selectedPackage === pkg.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
              `}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  value={pkg.id}
                  {...register('packageId', { required: '패키지를 선택해주세요' })}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-gray-500">{pkg.description}</p>
                </div>
              </div>
              <span className="font-semibold text-primary-600">
                {pkg.amount?.toLocaleString()}원
              </span>
            </label>
          ))}
        </div>
        {errors.packageId && (
          <p className="mt-1 text-sm text-red-500">{errors.packageId.message}</p>
        )}
      </div>

      {/* Contact Info */}
      <Input
        label="연락처"
        placeholder="010-0000-0000"
        {...register('phone', { required: '연락처를 입력해주세요' })}
        error={errors.phone?.message}
      />

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
