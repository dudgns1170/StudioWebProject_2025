package com.studiopick.domain.review.controller;

import com.studiopick.domain.review.dto.ReviewCreateRequest;
import com.studiopick.domain.review.dto.ReviewResponse;
import com.studiopick.domain.review.service.ReviewService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Review", description = "후기 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "후기 작성")
    @PostMapping(value = "/reviews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestPart("data") ReviewCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReviewResponse response = reviewService.createReview(userDetails.getUserId(), request, images);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "스튜디오 후기 목록")
    @GetMapping("/studios/{studioId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getStudioReviews(
            @PathVariable Long studioId) {
        List<ReviewResponse> response = reviewService.getStudioReviews(studioId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "내가 쓴 후기")
    @GetMapping("/reviews/my")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReviewResponse> response = reviewService.getMyReviews(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "후기 수정")
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReviewResponse response = reviewService.updateReview(reviewId, userDetails.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "후기 삭제")
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.deleteReview(reviewId, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
