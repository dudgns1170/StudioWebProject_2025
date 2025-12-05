package com.studiopick.domain.studio.entity;

import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 스튜디오 프로필 (상세 정보) 엔티티
 * - 사진관의 공개 정보 (주소, 설명, 촬영종류, 가격 등)
 * - Studio와 1:1 관계
 */
@Entity
@Table(name = "studio_profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StudioProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id", nullable = false)
    private Studio studio;

    @Column(nullable = false)
    private String name;  // 상호명 (고객에게 보여줄 이름)

    @Column(nullable = false)
    private String address;  // 상세 주소

    @Column(nullable = false)
    private String city;  // 경기도 시/구 (수원시, 성남시 등)

    @Column(columnDefinition = "TEXT")
    private String description;  // 스튜디오 소개

    @ElementCollection
    @CollectionTable(name = "studio_shooting_types", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "shooting_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private List<ShootingType> shootingTypes = new ArrayList<>();

    private Integer minPrice;  // 최저 가격
    private Integer maxPrice;  // 최대 가격

    private BigDecimal latitude;   // 위도
    private BigDecimal longitude;  // 경도

    private String thumbnailUrl;  // 대표 이미지

    private String operatingHours;  // 운영 시간

    @Builder.Default
    private Double rating = 0.0;  // 평균 평점

    @Builder.Default
    private Integer reviewCount = 0;  // 후기 수

    public enum ShootingType {
        BODY_PROFILE,   // 바디프로필
        PORTRAIT,       // 증명/프로필
        FAMILY,         // 가족사진
        COUPLE,         // 커플사진
        WEDDING,        // 웨딩
        GRADUATION,     // 졸업사진
        PET,            // 반려동물
        COMMERCIAL      // 상업/제품
    }

    public void update(String name, String address, String city, String description,
                       List<ShootingType> shootingTypes, Integer minPrice, Integer maxPrice,
                       String operatingHours) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.description = description;
        this.shootingTypes = shootingTypes;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.operatingHours = operatingHours;
    }

    public void updateLocation(BigDecimal latitude, BigDecimal longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void updateThumbnail(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public void updateRating(Double rating, Integer reviewCount) {
        this.rating = rating;
        this.reviewCount = reviewCount;
    }
}
