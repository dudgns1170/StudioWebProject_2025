package com.studiopick.domain.studio.service;

import com.studiopick.domain.studio.dto.*;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.studio.repository.StudioProfileRepository;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudioService {

    private final StudioRepository studioRepository;
    private final StudioProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 기업 회원가입
     */
    @Transactional
    public Studio signup(StudioSignupRequest request) {
        if (studioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        if (studioRepository.existsByBusinessNumber(request.getBusinessNumber())) {
            throw new BusinessException(ErrorCode.DUPLICATE_BUSINESS_NUMBER);
        }

        Studio studio = Studio.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .businessName(request.getBusinessName())
                .ownerName(request.getOwnerName())
                .phone(request.getPhone())
                .businessNumber(request.getBusinessNumber())
                .build();

        return studioRepository.save(studio);
    }

    /**
     * 스튜디오 목록 조회 (필터링)
     */
    public Page<StudioResponse> getStudios(String city, String shootingType,
                                           Integer minPrice, Integer maxPrice, Pageable pageable) {
        Page<StudioProfile> profiles;
        Studio.StudioStatus approvedStatus = Studio.StudioStatus.APPROVED;

        if (shootingType != null && !shootingType.isEmpty()) {
            StudioProfile.ShootingType type = StudioProfile.ShootingType.valueOf(shootingType);
            profiles = profileRepository.findByFiltersWithShootingType(approvedStatus, city, type, minPrice, maxPrice, pageable);
        } else {
            profiles = profileRepository.findByFilters(approvedStatus, city, minPrice, maxPrice, pageable);
        }

        return profiles.map(StudioResponse::from);
    }

    /**
     * 스튜디오 상세 조회 (profileId 기준)
     */
    public StudioDetailResponse getStudioByProfileId(Long profileId) {
        StudioProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));
        return StudioDetailResponse.from(profile);
    }

    /**
     * 스튜디오 상세 조회 (studioId 기준)
     */
    public StudioDetailResponse getStudioByStudioId(Long studioId) {
        StudioProfile profile = profileRepository.findByStudioId(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));
        return StudioDetailResponse.from(profile);
    }

    /**
     * 내 스튜디오 조회 (기업회원용)
     */
    public StudioDetailResponse getMyStudio(Long studioId) {
        StudioProfile profile = profileRepository.findByStudioId(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_PROFILE_NOT_FOUND));
        return StudioDetailResponse.from(profile);
    }

    /**
     * 스튜디오 프로필 생성
     */
    @Transactional
    public StudioDetailResponse createProfile(Long studioId, StudioProfileRequest request) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));

        if (profileRepository.findByStudioId(studioId).isPresent()) {
            throw new BusinessException(ErrorCode.STUDIO_PROFILE_ALREADY_EXISTS);
        }

        StudioProfile profile = StudioProfile.builder()
                .studio(studio)
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .district(request.getDistrict())
                .description(request.getDescription())
                .shootingTypes(request.getShootingTypes())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .operatingHours(request.getOperatingHours())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        StudioProfile savedProfile = profileRepository.save(profile);
        return StudioDetailResponse.from(savedProfile);
    }

    /**
     * 스튜디오 프로필 수정
     */
    @Transactional
    public StudioDetailResponse updateProfile(Long studioId, StudioProfileRequest request) {
        StudioProfile profile = profileRepository.findByStudioId(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_PROFILE_NOT_FOUND));

        profile.update(
                request.getName(),
                request.getAddress(),
                request.getCity(),
                request.getDistrict(),
                request.getDescription(),
                request.getShootingTypes(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getOperatingHours()
        );

        if (request.getLatitude() != null && request.getLongitude() != null) {
            profile.updateLocation(request.getLatitude(), request.getLongitude());
        }

        return StudioDetailResponse.from(profile);
    }

    /**
     * 스튜디오 삭제
     */
    @Transactional
    public void deleteStudio(Long studioId) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));
        studioRepository.delete(studio);
    }
}
