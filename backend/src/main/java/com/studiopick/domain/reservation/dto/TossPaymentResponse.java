package com.studiopick.domain.reservation.dto;


import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class TossPaymentResponse {
    // 기본 정보
    private String mId;               // 상점 ID
    private String paymentKey;        // 결제 키
    private String orderId;           // 주문 ID
    private String orderName;         // 주문명
    private String currency;          // 통화 (KRW)
    private Integer totalAmount;      // 총 결제 금액
    private Integer balanceAmount;    // 잔액
    
    // 상태 정보
    private String status;            // 결제 상태 (READY, IN_PROGRESS, PAID, CANCELLED, FAILED)
    private String requestedAt;       // 요청 시각
    private String approvedAt;        // 승인 시각
    private String cancelledAt;       // 취소 시각
    
    // 카드 정보
    private Card card;
    
    // 내부 카드 정보 클래스
    @Getter
    @Builder
    public static class Card {
        private String company;       // 카드사
        private String number;        // 카드번호 (마스킹)
        private String installmentPlanMonths; // 할부 개월 수
        private String approveNo;     // 승인번호
        private String useCardPoint;  // 카드포인트 사용 여부
        private String cardType;      // 카드 종류 (신용, 체크, 기프트)
        private String ownerType;     // 카드 소유자 (개인, 법인)
    }
}