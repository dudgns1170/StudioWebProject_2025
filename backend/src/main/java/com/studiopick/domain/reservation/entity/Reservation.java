package com.studiopick.domain.reservation.entity;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.user.entity.User;
import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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

    @Enumerated(EnumType.STRING)
    private StudioProfile.ShootingType shootingType;  // 촬영 종류

    private String options;  // 메이크업 등 옵션 (JSON or 문자열)

    @Column(columnDefinition = "TEXT")
    private String message;  // 요청사항

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
