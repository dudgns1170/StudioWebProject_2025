package com.studiopick.domain.reservation.dto;

import com.studiopick.domain.studio.entity.StudioProfile;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class ReservationCreateRequest {

    @NotNull(message = "스튜디오 ID는 필수입니다")
    private Long studioId;

    @NotNull(message = "희망 날짜는 필수입니다")
    private LocalDate preferredDate;

    private String preferredTime;  // 희망 시간대 (오전, 오후 등)

    @NotNull(message = "촬영 종류는 필수입니다")
    private StudioProfile.ShootingType shootingType;

    private String options;  // 메이크업 등 옵션

    private String message;  // 요청사항
}
