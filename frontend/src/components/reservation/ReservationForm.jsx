import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import ko from "date-fns/locale/ko";
import { useCreateReservation } from "../../hooks/useReservation";
import { useAuthStore } from "../../store/authStore";
import Button from "../common/Button";
import DatePicker from "./DatePicker";
import TossPaymentWidget from "../payment/TossPaymentWidget";
import { SHOOTING_TYPES } from "../../utils/constants";

// 예약 가능 시간대 (9시~20시, 1시간 단위)
const TIME_SLOTS = [
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
];

// 예약금 금액 (노쇼 방지)
const DEPOSIT_AMOUNT = 10000;

function ReservationForm({ studioId, onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const createReservation = useCreateReservation();
  const { user } = useAuthStore(); // 사용자 정보 가져오기
  const [showPayment, setShowPayment] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const onSubmit = (data) => {
    if (!selectedDate) {
      alert("예약 날짜를 선택해주세요.");
      return;
    }

    // 예약 데이터 저장 후 결제 화면으로 전환
    const formData = {
      studioId: Number(studioId),
      preferredDate: format(selectedDate, "yyyy-MM-dd"),
      preferredTime: data.time,
      shootingType: data.shootingType,
      options: null,
      message: data.message || null,
      depositAmount: DEPOSIT_AMOUNT,
    };

    setReservationData(formData);
    setShowPayment(true);
  };

  // 결제 완료 후 예약 생성
  const handlePaymentSuccess = (paymentData) => {
    const finalData = {
      ...reservationData,
      paymentKey: paymentData.paymentKey,
      orderId: paymentData.orderId,
    };

    createReservation.mutate(finalData, {
      onSuccess: () => {
        alert("예약금 결제 및 예약 요청이 완료되었습니다!");
        onSuccess?.();
      },
      onError: (error) => {
        alert(error.response?.data?.message || "예약 요청에 실패했습니다.");
        setShowPayment(false);
      },
    });
  };

  // 결제 화면
  if (showPayment) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            예약금 결제
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>
              • 노쇼 방지를 위해 예약금 {DEPOSIT_AMOUNT.toLocaleString()}원이
              결제됩니다.
            </p>
            <p>• 예약금은 촬영 완료 후 촬영 비용에서 차감됩니다.</p>
            <p>• 예약 취소 시 환불 정책에 따라 처리됩니다.</p>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">예약금</span>
              <span className="text-xl font-bold text-primary-600">
                {DEPOSIT_AMOUNT.toLocaleString()}원
              </span>
            </div>
            {/* PG 결제 버튼 영역 - 토스페이먼츠 연동 */}
            <div className="mb-4">
              <TossPaymentWidget
                amount={{ currency: "KRW", value: DEPOSIT_AMOUNT }}
                orderName={`${studioId}번 스튜디오 예약금`}
                customerEmail={user?.email || "guest@example.com"}
                customerName={user?.name || "게스트"}
                reservationData={reservationData}
                onSuccess={(paymentData) => {
                  handlePaymentSuccess(paymentData);
                }}
                onCancel={(error) => {
                  alert(`결제가 취소되었습니다: ${error}`);
                  setShowPayment(false);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="w-full mt-2 text-gray-500 text-sm hover:text-gray-700"
            >
              이전으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 날짜{" "}
          {selectedDate && (
            <span className="text-primary-600 font-normal">
              - {format(selectedDate, "yyyy년 M월 d일 (EEEE)", { locale: ko })}
            </span>
          )}
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setValue("date", date)}
        />
      </div>

      {/* Time Selection - 1시간 단위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          희망 시간
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <label
              key={slot.value}
              className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                selectedTime === slot.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 hover:border-primary-300"
              }`}
            >
              <input
                type="radio"
                {...register("time", { required: "시간을 선택해주세요" })}
                value={slot.value}
                className="sr-only"
              />
              <span className="text-sm font-medium">{slot.label}</span>
            </label>
          ))}
        </div>
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
          {...register("shootingType", {
            required: "촬영 종류를 선택해주세요",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">촬영 종류 선택</option>
          {Object.entries(SHOOTING_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {errors.shootingType && (
          <p className="mt-1 text-sm text-red-500">
            {errors.shootingType.message}
          </p>
        )}
      </div>

      {/* Request Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          요청사항
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="촬영 관련 요청사항을 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" fullWidth loading={createReservation.isPending}>
        예약 요청하기
      </Button>
    </form>
  );
}

export default ReservationForm;
