package com.studiopick.domain.portfolio.service;

import com.studiopick.domain.portfolio.dto.PortfolioResponse;
import com.studiopick.domain.portfolio.entity.Portfolio;
import com.studiopick.domain.portfolio.repository.PortfolioRepository;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import com.studiopick.infra.s3.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final StudioRepository studioRepository;
    private final S3Service s3Service;

    public List<PortfolioResponse> getPortfolios(Long studioId) {
        return portfolioRepository.findByStudioIdOrderByDisplayOrderAsc(studioId)
                .stream()
                .map(PortfolioResponse::from)
                .toList();
    }

    @Transactional
    public PortfolioResponse createPortfolio(Long studioId, MultipartFile image) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDIO_NOT_FOUND));

        String imageUrl = s3Service.uploadFile(image, "portfolio");

        Portfolio portfolio = Portfolio.builder()
                .studio(studio)
                .imageUrl(imageUrl)
                .build();

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioResponse.from(savedPortfolio);
    }

    @Transactional
    public void deletePortfolio(Long portfolioId, Long studioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PORTFOLIO_NOT_FOUND));

        if (!portfolio.getStudio().getId().equals(studioId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        s3Service.deleteFile(portfolio.getImageUrl());
        portfolioRepository.delete(portfolio);
    }
}
