package com.studiopick.domain.studio.dto;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

/**
 * 스튜디오 상세 조회용 응답 DTO
 */
@Getter
@Builder
public class StudioDetailResponse {

    private Long id;           // StudioProfile ID
    private Long studioId;     // Studio ID
    private String name;
    private String description;
    private String thumbnailUrl;
    private String city;
    private String district;
    private String address;
    private String phone;
    private String operatingHours;
    private List<String> shootingTypes;
    private Integer minPrice;
    private Integer maxPrice;
    private Double rating;
    private Integer reviewCount;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String status;  // Studio 승인 상태

    public static StudioDetailResponse from(StudioProfile profile) {
        Studio studio = profile.getStudio();
        return StudioDetailResponse.builder()
                .id(profile.getId())
                .studioId(studio.getId())
                .name(profile.getName())
                .description(profile.getDescription())
                .thumbnailUrl(profile.getThumbnailUrl())
                .city(profile.getCity())
                .district(profile.getDistrict())
                .address(profile.getAddress())
                .phone(studio.getPhone())
                .operatingHours(profile.getOperatingHours())
                .shootingTypes(profile.getShootingTypes().stream()
                        .map(Enum::name)
                        .toList())
                .minPrice(profile.getMinPrice())
                .maxPrice(profile.getMaxPrice())
                .rating(profile.getRating())
                .reviewCount(profile.getReviewCount())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .status(studio.getStatus().name())
                .build();
    }
}
