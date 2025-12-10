package com.studiopick.domain.reservation.service;

import com.studiopick.domain.reservation.dto.ReservationCreateRequest;
import com.studiopick.domain.reservation.dto.ReservationResponse;
import com.studiopick.domain.reservation.entity.Reservation;
import com.studiopick.domain.reservation.repository.ReservationRepository;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final StudioRepository studioRepository;
    private final UserRepository userRepository;

    /**
     * 예약 요청 (일반회원)
     */
    @Transactional
    public ReservationResponse createReservation(Long userId, ReservationCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Studio studio = studioRepository.findById(request.getStudioId())
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));

        // 승인된 스튜디오인지 확인
        if (studio.getStatus() != Studio.StudioStatus.APPROVED) {
            throw new BusinessException(ErrorCode.STUDIO_NOT_APPROVED);
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .studio(studio)
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .shootingType(request.getShootingType())
                .options(request.getOptions())
                .message(request.getMessage())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return ReservationResponse.from(savedReservation);
    }

    /**
     * 내 예약 목록 (일반회원)
     */
    public List<ReservationResponse> getMyReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    /**
     * 받은 예약 목록 (기업회원)
     */
    public List<ReservationResponse> getStudioReservations(Long studioId) {
        return reservationRepository.findByStudioIdOrderByCreatedAtDesc(studioId)
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    /**
     * 예약 상세 조회
     */
    public ReservationResponse getReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
        return ReservationResponse.from(reservation);
    }

    /**
     * 예약 승인 (기업회원)
     */
    @Transactional
    public ReservationResponse approveReservation(Long reservationId, Long studioId) {
        Reservation reservation = getReservationWithStudioCheck(reservationId, studioId);
        reservation.approve();
        return ReservationResponse.from(reservation);
    }

    /**
     * 예약 거절 (기업회원)
     */
    @Transactional
    public ReservationResponse rejectReservation(Long reservationId, Long studioId) {
        Reservation reservation = getReservationWithStudioCheck(reservationId, studioId);
        reservation.reject();
        return ReservationResponse.from(reservation);
    }

    /**
     * 예약 완료 (기업회원)
     */
    @Transactional
    public ReservationResponse completeReservation(Long reservationId, Long studioId) {
        Reservation reservation = getReservationWithStudioCheck(reservationId, studioId);
        reservation.complete();
        return ReservationResponse.from(reservation);
    }

    /**
     * 예약 취소 (일반회원)
     */
    @Transactional
    public void cancelReservation(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        reservation.cancel();
    }

    private Reservation getReservationWithStudioCheck(Long reservationId, Long studioId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if (!reservation.getStudio().getId().equals(studioId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        return reservation;
    }
}
