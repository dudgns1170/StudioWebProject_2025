package com.studiopick.domain.studio.dto;

import com.studiopick.domain.studio.entity.StudioProfile;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * 스튜디오 프로필 생성/수정 요청 DTO
 */
@Getter
@NoArgsConstructor
public class StudioProfileRequest {

    @NotBlank(message = "상호명은 필수입니다")
    private String name;

    @NotBlank(message = "주소는 필수입니다")
    private String address;

    @NotBlank(message = "지역(시)은 필수입니다")
    private String city;

    private String district;  // 구/동 (팔달구, 분당구 등)

    private String description;

    private List<StudioProfile.ShootingType> shootingTypes;

    private Integer minPrice;

    private Integer maxPrice;

    private String operatingHours;

    private BigDecimal latitude;

    private BigDecimal longitude;
}
