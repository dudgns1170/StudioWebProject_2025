package com.studiopick.domain.reservation.dto;

import com.studiopick.domain.studio.entity.StudioProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class PaymentPrepareRequest {

    @NotNull(message = "스튜디오 ID는 필수입니다")
    private Long studioId;

    @NotNull(message = "희망 날짜는 필수입니다")
    private LocalDate preferredDate;

    @NotBlank(message = "희망 시간은 필수입니다")
    @Pattern(regexp = "^(0[9]|1[0-9]|20):00$", message = "유효한 시간 형식이 아닙니다 (09:00~20:00)")
    private String preferredTime;

    @NotNull(message = "촬영 종류는 필수입니다")
    private StudioProfile.ShootingType shootingType;

    @Size(max = 500, message = "요청사항은 500자 이내로 입력해주세요")
    private String message;
}
