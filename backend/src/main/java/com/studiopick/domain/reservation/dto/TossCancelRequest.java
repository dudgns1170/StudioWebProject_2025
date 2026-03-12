package com.studiopick.domain.reservation.dto;

import lombok.Builder;
import lombok.Getter;
 
@Getter
@Builder
public class TossCancelRequest {
    private String cancelReason;      // 취소 사유 (필수)
    
    // 선택적 필드들
    private Integer cancelAmount;     // 취소 금액 (부분 취소 시)
    private Integer refundReceiveAccount; // 환불 계좌 (현금 영업일 취소 시)
    private String refundReceiveAccountHolder; // 환불 계좌주
    private String refundReceiveBank;  // 환불 은행
    
    // 고객 정보
    private String customerIdentityNumber; // 주민등록번호 (일부 마스킹)
    private String customerBirthday;     // 생년월일
    private String customerEmail;        // 고객 이메일
}