package com.studiopick.domain.reservation.dto;

import com.studiopick.domain.reservation.entity.Reservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {

    private Long id;
    private StudioInfo studio;
    private UserInfo user;
    private LocalDate preferredDate;
    private String shootingType;
    private String options;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class StudioInfo {
        private Long id;
        private String name;
    }

    @Getter
    @Builder
    public static class UserInfo {
        private Long id;
        private String name;
        private String phone;
    }

    public static ReservationResponse from(Reservation reservation) {
        String studioName = reservation.getStudio().getProfile() != null
                ? reservation.getStudio().getProfile().getName()
                : reservation.getStudio().getBusinessName();

        return ReservationResponse.builder()
                .id(reservation.getId())
                .studio(StudioInfo.builder()
                        .id(reservation.getStudio().getId())
                        .name(studioName)
                        .build())
                .user(UserInfo.builder()
                        .id(reservation.getUser().getId())
                        .name(reservation.getUser().getName())
                        .phone(reservation.getUser().getPhone())
                        .build())
                .preferredDate(reservation.getPreferredDate())
                .shootingType(reservation.getShootingType() != null
                        ? reservation.getShootingType().name() : null)
                .options(reservation.getOptions())
                .message(reservation.getMessage())
                .status(reservation.getStatus().name())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
