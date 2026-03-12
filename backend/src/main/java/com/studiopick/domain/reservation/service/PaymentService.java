package com.studiopick.domain.reservation.service;

import com.studiopick.domain.reservation.dto.ReservationResponse;
import com.studiopick.domain.reservation.dto.PaymentConfirmRequest;
import com.studiopick.domain.reservation.dto.PaymentPrepareRequest;
import com.studiopick.domain.reservation.dto.PaymentPrepareResponse;
import com.studiopick.domain.reservation.dto.PaymentWebhookRequest;
import com.studiopick.domain.reservation.dto.TossPaymentConfirmRequest;
import com.studiopick.domain.reservation.dto.TossPaymentResponse;
import com.studiopick.domain.reservation.entity.Reservation;
import com.studiopick.domain.reservation.repository.ReservationRepository;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import com.studiopick.global.config.TossPaymentsClient;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final StudioRepository studioRepository;
    private final UserRepository userRepository;
    private final TossPaymentsClient tossPaymentsClient;

    @Value("${payment.deposit-amount:10000}")
    private int depositAmount;

    @Transactional
    public PaymentPrepareResponse prepareDeposit(Long userId, PaymentPrepareRequest request) {
        System.out.println("=== [DEBUG] prepareDeposit 시작 ===");
        System.out.println("userId: " + userId);
        System.out.println("studioId: " + request.getStudioId());
        System.out.println("preferredDate: " + request.getPreferredDate());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Studio studio = studioRepository.findById(request.getStudioId())
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));

        if (studio.getStatus() != Studio.StudioStatus.APPROVED) {
            throw new BusinessException(ErrorCode.STUDIO_NOT_APPROVED);
        }

        String orderId = "order_" + UUID.randomUUID();
        System.out.println("생성된 orderId: " + orderId);

        Reservation reservation = Reservation.builder()
                .user(user)
                .studio(studio)
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .shootingType(request.getShootingType())
                .message(request.getMessage())
                .orderId(orderId)
                .depositAmount(depositAmount)
                .paymentStatus(Reservation.PaymentStatus.PENDING)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        System.out.println("저장된 reservationId: " + savedReservation.getId());

        String studioName = studio.getProfile() != null ? studio.getProfile().getName() : studio.getBusinessName();

        PaymentPrepareResponse response = PaymentPrepareResponse.builder()
                .orderId(orderId)
                .orderName(studioName + " 예약금")
                .amount(depositAmount)
                .reservationId(savedReservation.getId())
                .build();
        
        System.out.println("=== [DEBUG] prepareDeposit 응답 ===");
        System.out.println("orderId: " + response.getOrderId());
        System.out.println("amount: " + response.getAmount());
        System.out.println("=====================================\n");
        
        return response;
    }

    @Transactional
    public ReservationResponse confirmDeposit(Long userId, PaymentConfirmRequest request) {
        System.out.println("\n=== [DEBUG] confirmDeposit 시작 ===");
        System.out.println("userId: " + userId);
        System.out.println("orderId: " + request.getOrderId());
        System.out.println("paymentKey: " + request.getPaymentKey());
        System.out.println("amount: " + request.getAmount());
        
        Reservation reservation = reservationRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if(!reservation.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (reservation.getDepositAmount() == null || !reservation.getDepositAmount().equals(request.getAmount())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        //토스 결제 확인 API 호출
        TossPaymentConfirmRequest tossReq = TossPaymentConfirmRequest.builder()
                .paymentKey(request.getPaymentKey())
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .build();
        
        System.out.println("=== [DEBUG] 토스 API 호출 ===");
        System.out.println("요청 파라미터:");
        System.out.println("  - paymentKey: " + tossReq.getPaymentKey());
        System.out.println("  - orderId: " + tossReq.getOrderId());
        System.out.println("  - amount: " + tossReq.getAmount());
        
        try{
            TossPaymentResponse tossRes = tossPaymentsClient.confirmPayment(tossReq).block();
            
            System.out.println("=== [DEBUG] 토스 API 응답 ===");
            System.out.println("status: " + tossRes.getStatus());
            System.out.println("totalAmount: " + tossRes.getTotalAmount());
            System.out.println("paymentKey: " + tossRes.getPaymentKey());

            //상태값
            if(!"PAID".equals(tossRes.getStatus())) {
                System.out.println("[ERROR] 결제 상태가 PAID가 아님: " + tossRes.getStatus());
                throw new BusinessException(ErrorCode.PAYMENT_FAILED);
            }
            //금액 설정
            if(!tossRes.getTotalAmount().equals(reservation.getDepositAmount())) {
                System.out.println("[ERROR] 금액 불일치");
                System.out.println("  - 응답 금액: " + tossRes.getTotalAmount());
                System.out.println("  - 예약금: " + reservation.getDepositAmount());
                throw new BusinessException(ErrorCode.PAYMENT_FAILED);
            }
            
            //예약 상태 업데이트
            reservation.setDepositStatus("PAID");
            reservation.setDepositPaymentKey(request.getPaymentKey());
            reservation.setDepositPaidAt(LocalDateTime.now());
            //결제 승인 처리
            reservation.markPaid(request.getPaymentKey());
            
            System.out.println("=== [DEBUG] 결제 처리 완료 ===");
            System.out.println("reservationId: " + reservation.getId());
            System.out.println("=====================================\n");
            
        } catch (Exception e) {
            System.out.println("[ERROR] 토스 API 호출 실패: " + e.getMessage());
            e.printStackTrace();
            throw new BusinessException(ErrorCode.PAYMENT_FAILED);
        }

        return ReservationResponse.from(reservation);
    }

    @Transactional
    public void handleWebhook(PaymentWebhookRequest request) {
        reservationRepository.findByOrderId(request.getOrderId())
                .ifPresent(reservation -> {
                    if (reservation.getDepositAmount() != null && !reservation.getDepositAmount().equals(request.getAmount())) {
                        return;
                    }

                    String status = request.getStatus().toUpperCase();
                    if ("PAID".equals(status)) {
                        reservation.markPaid(request.getPaymentKey());
                    } else if ("CANCELLED".equals(status)) {
                        reservation.markPaymentCancelled();
                    } else if ("REFUNDED".equals(status)) {
                        reservation.markRefunded();
                    }
                });
    }

    //결제 취소
    @Transactional
    public TossPaymentResponse cancelPayment(
        Long userId, 
        Long reservationId, 
        String cancelReason,
        String idempotencyKey
    ) {
        System.out.println("\n=== [DEBUG] cancelPayment 시작 ===");
        System.out.println("userId: " + userId);
        System.out.println("reservationId: " + reservationId);
        System.out.println("cancelReason: " + cancelReason);
        System.out.println("idempotencyKey: " + idempotencyKey);
        
        // 1. 예약 조회
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
        
        // 2. 권한 확인
        if (!reservation.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        
        // 3. 결제 상태 확인
        if (reservation.getPaymentStatus() != Reservation.PaymentStatus.PAID) {
            System.out.println("[ERROR] 결제되지 않은 예약: " + reservation.getPaymentStatus());
            throw new BusinessException(ErrorCode.PAYMENT_NOT_PAID);
        }
        
        // 4. 취소 요청 생성
        TossCancelRequest cancelRequest = TossCancelRequest.builder()
                .cancelReason(cancelReason)
                .build();
        
        String paymentKey = reservation.getDepositPaymentKey();
        System.out.println("취소할 paymentKey: " + paymentKey);
        
        try {
            // 5. 토스에 취소 요청
            TossPaymentResponse tossResponse = tossPaymentsClient
                    .cancelPayment(paymentKey, cancelRequest, idempotencyKey)
                    .block();
            
            System.out.println("=== [DEBUG] 토스 취소 응답 ===");
            System.out.println("status: " + tossResponse.getStatus());
            System.out.println("cancelledAt: " + tossResponse.getCancelledAt());
            
            // 6. 응답 검증
            if (!"CANCELLED".equals(tossResponse.getStatus())) {
                System.out.println("[ERROR] 취소 상태가 아님: " + tossResponse.getStatus());
                throw new BusinessException(ErrorCode.PAYMENT_CANCEL_FAILED);
            }
            
            // 7. DB 업데이트
            reservation.markPaymentCancelled();
            reservation.setDepositStatus("CANCELLED");
            reservation.setDepositPaidAt(null);
            
            System.out.println("=== [DEBUG] 결제 취소 완료 ===");
            System.out.println("reservationId: " + reservation.getId());
            System.out.println("=====================================\n");
            
            return tossResponse;
            
        } catch (Exception e) {
            System.out.println("[ERROR] 결제 취소 실패: " + e.getMessage());
            e.printStackTrace();
            throw new BusinessException(ErrorCode.PAYMENT_CANCEL_FAILED);
        }
    }
}
