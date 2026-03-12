import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import Loading from '../components/common/Loading';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  const confirmPayment = useMutation({
    mutationFn: paymentApi.confirmDeposit,
    onSuccess: (data) => {
      setIsProcessing(false);
      // 3초 후 마이페이지로 이동
      setTimeout(() => {
        navigate('/mypage/reservations', { replace: true });
      }, 3000);
    },
    onError: (error) => {
      setIsProcessing(false);
      console.error('결제 승인 실패:', error);
    },
  });

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (paymentKey && orderId && amount) {
      // 결제 승인 요청
      confirmPayment.mutate({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      });
    } else {
      setIsProcessing(false);
    }
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loading fullScreen={false} />
          <p className="mt-4 text-gray-600">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다</h1>
          <p className="text-gray-600 mb-6">
            예약이 정상적으로 접수되었습니다.<br />
            스튜디오 확인 후 최종 확정됩니다.
          </p>
          {confirmPayment.isSuccess && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-1">예약번호</p>
              <p className="font-medium text-gray-900">
                {confirmPayment.data?.data?.reservationId || '처리 중...'}
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/mypage/reservations')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            예약 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
