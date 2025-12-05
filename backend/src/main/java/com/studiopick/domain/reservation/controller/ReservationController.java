package com.studiopick.domain.reservation.controller;

import com.studiopick.domain.reservation.dto.ReservationCreateRequest;
import com.studiopick.domain.reservation.dto.ReservationResponse;
import com.studiopick.domain.reservation.service.ReservationService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.security.CustomStudioDetails;
import com.studiopick.global.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reservation", description = "예약 API")
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Operation(summary = "예약 요청 (일반회원)")
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @Valid @RequestBody ReservationCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = reservationService.createReservation(userDetails.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "내 예약 목록 (일반회원)")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReservationResponse> response = reservationService.getMyReservations(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "받은 예약 목록 (기업회원)")
    @GetMapping("/studio")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getStudioReservations(
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        List<ReservationResponse> response = reservationService.getStudioReservations(studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약 상세")
    @GetMapping("/{reservationId}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservation(
            @PathVariable Long reservationId) {
        ReservationResponse response = reservationService.getReservation(reservationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약 승인 (기업회원)")
    @PutMapping("/{reservationId}/approve")
    public ResponseEntity<ApiResponse<ReservationResponse>> approveReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        ReservationResponse response = reservationService.approveReservation(reservationId, studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약 거절 (기업회원)")
    @PutMapping("/{reservationId}/reject")
    public ResponseEntity<ApiResponse<ReservationResponse>> rejectReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        ReservationResponse response = reservationService.rejectReservation(reservationId, studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약 완료 (기업회원)")
    @PutMapping("/{reservationId}/complete")
    public ResponseEntity<ApiResponse<ReservationResponse>> completeReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        ReservationResponse response = reservationService.completeReservation(reservationId, studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "예약 취소 (일반회원)")
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reservationService.cancelReservation(reservationId, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
