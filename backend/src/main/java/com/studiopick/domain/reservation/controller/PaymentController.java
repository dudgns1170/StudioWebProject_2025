package com.studiopick.domain.reservation.controller;

import com.studiopick.domain.reservation.dto.ReservationResponse;
import com.studiopick.domain.reservation.dto.PaymentConfirmRequest;
import com.studiopick.domain.reservation.dto.PaymentPrepareRequest;
import com.studiopick.domain.reservation.dto.PaymentPrepareResponse;
import com.studiopick.domain.reservation.dto.PaymentWebhookRequest;
import com.studiopick.domain.reservation.dto.TossCancelRequest;
import com.studiopick.domain.reservation.dto.TossPaymentResponse;
import com.studiopick.domain.reservation.service.PaymentService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Payment", description = "결제 API")
@RestController
@RequestMapping("/api/reservations/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "예약금 결제 준비 (일반회원)")
    @PostMapping("/deposit/prepare")
    public ResponseEntity<ApiResponse<PaymentPrepareResponse>> prepareDeposit(
            @Valid @RequestBody PaymentPrepareRequest
            request
            // @AuthenticationPrincipal CustomUserDetails userDetails  // 임시로 주석 처리
            ) {
        // TODO: 임시로 하드코딩된 userId 사용 (나중에 로그인된 사용자로 변경)
        Long userId = 1L;  // 테스트용 userId
        PaymentPrepareResponse response = paymentService.prepareDeposit(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약금 결제 승인/검증 후 예약 확정 (일반회원)")
    @PostMapping("/deposit/confirm")
    public ResponseEntity<ApiResponse<ReservationResponse>> confirmDeposit(
            @Valid @RequestBody PaymentConfirmRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = paymentService.confirmDeposit(userDetails.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "결제 웹훅 수신")
    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<Void>> webhook(
            @Valid @RequestBody PaymentWebhookRequest request) {
        paymentService.handleWebhook(request);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "결제 취소")
    @PostMapping("/cancel/{reservationId}")
    public ResponseEntity<ApiResponse<TossPaymentResponse>> cancelPayment(
            @PathVariable Long reservationId,
            @RequestParam String cancelReason,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // 멱등키 생성
        String idempotencyKey = UUID.randomUUID().toString();
        
        // 취소 처리
        TossPaymentResponse response = paymentService.cancelPayment(
            userDetails.getUser().getId(),
            reservationId,
            cancelReason,
            idempotencyKey
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
