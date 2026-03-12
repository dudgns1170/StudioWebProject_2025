package com.studiopick.domain.reservation.entity;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.user.entity.User;
import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 예약 엔티티
 * - 일반 회원이 스튜디오에 예약 요청
 */
@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id", nullable = false)
    private Studio studio;

    @Column(nullable = false)
    private LocalDate preferredDate;  // 희망 날짜

    private String preferredTime;  // 희망 시간대 (오전, 오후 등)

    @Enumerated(EnumType.STRING)
    private StudioProfile.ShootingType shootingType;  // 촬영 종류

    private String options;  // 메이크업 등 옵션 (JSON or 문자열)

    @Column(columnDefinition = "TEXT")
    private String message;  // 요청사항

    // 결제 관련 필드 (노쇼 방지 예약금)
    private String paymentKey;  // PG사 결제 키
    private String orderId;     // 주문 ID
    private Integer depositAmount;  // 예약금 금액
    
    // 추가 결제 관련 필드
    private String depositStatus;  // 예약금 상태
    private String depositPaymentKey;  // 예약금 결제 키
    private LocalDateTime depositPaidAt;  // 예약금 결제 시각

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;  // 결제 상태

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    public enum ReservationStatus {
        PENDING,    // 대기중
        APPROVED,   // 승인됨
        REJECTED,   // 거절됨
        COMPLETED,  // 완료
        CANCELLED   // 취소됨
    }

    public enum PaymentStatus {
        PENDING,    // 결제 대기
        PAID,       // 결제 완료
        REFUNDED,   // 환불됨
        CANCELLED   // 결제 취소
    }

     public void markPaid(String paymentKey) {
         this.paymentKey = paymentKey;
         this.paymentStatus = PaymentStatus.PAID;
     }

     public void markPaymentCancelled() {
         this.paymentStatus = PaymentStatus.CANCELLED;
     }

     public void markRefunded() {
         this.paymentStatus = PaymentStatus.REFUNDED;
     }
     
     // 추가 결제 관련 메서드
     public void setDepositStatus(String status) {
         this.depositStatus = status;
     }
     
     public void setDepositPaymentKey(String paymentKey) {
         this.depositPaymentKey = paymentKey;
     }
     
     public void setDepositPaidAt(LocalDateTime dateTime) {
         this.depositPaidAt = dateTime;
     }

    public void approve() {
        this.status = ReservationStatus.APPROVED;
    }

    public void reject() {
        this.status = ReservationStatus.REJECTED;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }
}
