import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "../../api/payment.api";

// 환경변수에서 클라이언트 키 가져오기
const clientKey =
  import.meta.env.VITE_TOSS_CLIENT_KEY ||
  "test_ck_AQ92ymxN34L2eP9ZOPWA3ajRKXvd";

export default function TossPaymentWidget({
  amount,
  orderName,
  customerEmail,
  customerName,
  onSuccess,
  onCancel,
  reservationData,
}) {
  const [payment, setPayment] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // 결제 준비 API 호출
  const preparePayment = useMutation({
    mutationFn: paymentApi.prepareDeposit,
    onSuccess: (response) => {
      console.log("결제 준비 성공:", response);
      setIsReady(true);
    },
    onError: (error) => {
      console.error("결제 준비 실패:", error);
      alert("결제 준비에 실패했습니다.");
    },
  });

  // 결제 승인 API 호출
  const confirmPayment = useMutation({
    mutationFn: paymentApi.confirmDeposit,
    onSuccess: (response) => {
      console.log("결제 승인 성공:", response);
      onSuccess(response);
    },
    onError: (error) => {
      console.error("결제 승인 실패:", error);
      alert("결제 처리에 실패했습니다.");
    },
  });

  // 토스페이먼츠 SDK 초기화
  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 비회원 결제 (로그인하지 않은 사용자도 결제 가능)
        const payment = tossPayments.payment({
          customerKey: ANONYMOUS,
        });

        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
  }, []);

  // 결제 요청
  async function requestPayment() {
    if (!payment) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }

    // 1. 결제 준비 요청
    const prepareData = {
      studioId: reservationData.studioId,
      preferredDate: reservationData.preferredDate,
      preferredTime: reservationData.preferredTime,
      shootingType: reservationData.shootingType,
      message: reservationData.message,
    };

    preparePayment.mutate(prepareData);
  }

  // 결제 준비가 완료되면 실제 결제창 띄우기
  useEffect(() => {
    if (isReady && payment && preparePayment.data?.data) {
      const {
        orderId,
        amount: paymentAmount,
        reservationId,
      } = preparePayment.data.data;

      // paymentAmount가 없으면 props로 받은 amount 사용
      const finalAmount = paymentAmount || amount.value;
      console.log("finalAmount::::", finalAmount);
      console.log("orderId::::", orderId);

      payment.requestPayment({
        method: "CARD", // 카드 및 간편결제
        amount: {
          currency: "KRW",
          value: finalAmount,
        },
        orderId: orderId,
        orderName: orderName,
        successUrl: `${window.location.origin}/payment/success?reservationId=${reservationId}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
        customerEmail: customerEmail,
        customerName: customerName,
        // 카드 결제 옵션
        card: {
          useEscrow: false,
          flowMode: "DEFAULT", // 통합결제창
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    }
  }, [isReady, payment, preparePayment.data, amount]);

  // URL 파라미터로 결제 결과 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const error = urlParams.get("error");

    if (paymentKey && orderId) {
      // 결제 성공
      confirmPayment.mutate({
        paymentKey: paymentKey,
        orderId: orderId,
        amount: amount?.value || 10000, // 기본값 10000원
      });
    } else if (error) {
      // 결제 실패
      console.error("결제 실패:", error);
      onCancel?.(error);
    }
  }, []);

  if (preparePayment.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">결제 준비 중...</span>
      </div>
    );
  }

  return (
    <button
      onClick={requestPayment}
      disabled={!payment || preparePayment.isLoading}
      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {amount.value.toLocaleString()}원 결제하기
    </button>
  );
}
