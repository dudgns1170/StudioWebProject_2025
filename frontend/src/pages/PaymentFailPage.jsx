import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // 실패 로그 기록 (필요시 서버에 전송)
    console.error('Payment failed:', {
      code: errorCode,
      message: errorMessage,
      orderId: orderId,
    });
  }, [errorCode, errorMessage, orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
          <p className="text-gray-600 mb-6">
            {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
          </p>
          
          {errorCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-1">오류 코드</p>
              <p className="font-medium text-red-600">{errorCode}</p>
              {orderId && (
                <>
                  <p className="text-sm text-gray-600 mb-1 mt-2">주문번호</p>
                  <p className="font-medium text-gray-900">{orderId}</p>
                </>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)} // 이전 페이지로
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              다시 시도하기
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              홈으로 가기
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            문제가 계속되면 고객센터로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailPage;
