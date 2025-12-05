package com.studiopick.domain.studio.controller;

import com.studiopick.domain.studio.dto.*;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.service.StudioService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.response.PageResponse;
import com.studiopick.global.security.CustomStudioDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Studio", description = "스튜디오 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StudioController {

    private final StudioService studioService;

    @Operation(summary = "스튜디오 목록 조회")
    @GetMapping("/studios")
    public ResponseEntity<ApiResponse<PageResponse<StudioResponse>>> getStudios(
            @RequestParam(name = "city", required = false) String city,
            @RequestParam(name = "shootingType", required = false) String shootingType,
            @RequestParam(name = "minPrice", required = false) Integer minPrice,
            @RequestParam(name = "maxPrice", required = false) Integer maxPrice,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<StudioResponse> studios = studioService.getStudios(city, shootingType, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(studios)));
    }

    @Operation(summary = "스튜디오 상세 조회")
    @GetMapping("/studios/{profileId}")
    public ResponseEntity<ApiResponse<StudioDetailResponse>> getStudio(
            @PathVariable Long profileId) {
        StudioDetailResponse response = studioService.getStudioByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "내 스튜디오 조회 (기업회원용)")
    @GetMapping("/studios/my")
    public ResponseEntity<ApiResponse<StudioDetailResponse>> getMyStudio(
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        StudioDetailResponse response = studioService.getMyStudio(studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "스튜디오 프로필 생성 (기업회원용)")
    @PostMapping("/studios/profile")
    public ResponseEntity<ApiResponse<StudioDetailResponse>> createProfile(
            @Valid @RequestBody StudioProfileRequest request,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        StudioDetailResponse response = studioService.createProfile(studioDetails.getStudioId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "스튜디오 프로필 수정 (기업회원용)")
    @PutMapping("/studios/profile")
    public ResponseEntity<ApiResponse<StudioDetailResponse>> updateProfile(
            @Valid @RequestBody StudioProfileRequest request,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        StudioDetailResponse response = studioService.updateProfile(studioDetails.getStudioId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "스튜디오 삭제 (기업회원용)")
    @DeleteMapping("/studios")
    public ResponseEntity<ApiResponse<Void>> deleteStudio(
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        studioService.deleteStudio(studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
