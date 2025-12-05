package com.studiopick.domain.studio.dto;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 스튜디오 목록 조회용 응답 DTO
 */
@Getter
@Builder
public class StudioResponse {

    private Long id;
    private Long studioId;  // Studio 엔티티 ID
    private String name;
    private String thumbnailUrl;
    private String city;
    private List<String> shootingTypes;
    private Integer minPrice;
    private Integer maxPrice;
    private Double rating;
    private Integer reviewCount;

    public static StudioResponse from(StudioProfile profile) {
        return StudioResponse.builder()
                .id(profile.getId())
                .studioId(profile.getStudio().getId())
                .name(profile.getName())
                .thumbnailUrl(profile.getThumbnailUrl())
                .city(profile.getCity())
                .shootingTypes(profile.getShootingTypes().stream()
                        .map(Enum::name)
                        .toList())
                .minPrice(profile.getMinPrice())
                .maxPrice(profile.getMaxPrice())
                .rating(profile.getRating())
                .reviewCount(profile.getReviewCount())
                .build();
    }
}
