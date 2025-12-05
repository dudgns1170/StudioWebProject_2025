package com.studiopick.domain.portfolio.controller;

import com.studiopick.domain.portfolio.dto.PortfolioResponse;
import com.studiopick.domain.portfolio.service.PortfolioService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.security.CustomStudioDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Portfolio", description = "포트폴리오 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @Operation(summary = "포트폴리오 목록 조회")
    @GetMapping("/studios/{studioId}/portfolios")
    public ResponseEntity<ApiResponse<List<PortfolioResponse>>> getPortfolios(
            @PathVariable Long studioId) {
        List<PortfolioResponse> response = portfolioService.getPortfolios(studioId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "포트폴리오 등록 (기업회원)")
    @PostMapping(value = "/studios/portfolios", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PortfolioResponse>> createPortfolio(
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        PortfolioResponse response = portfolioService.createPortfolio(studioDetails.getStudioId(), image);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "포트폴리오 삭제 (기업회원)")
    @DeleteMapping("/portfolios/{portfolioId}")
    public ResponseEntity<ApiResponse<Void>> deletePortfolio(
            @PathVariable Long portfolioId,
            @AuthenticationPrincipal CustomStudioDetails studioDetails) {
        portfolioService.deletePortfolio(portfolioId, studioDetails.getStudioId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
