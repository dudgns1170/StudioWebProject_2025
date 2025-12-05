package com.studiopick.domain.portfolio.dto;

import com.studiopick.domain.portfolio.entity.Portfolio;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioResponse {

    private Long id;
    private String imageUrl;
    private String title;
    private String description;
    private Integer displayOrder;

    public static PortfolioResponse from(Portfolio portfolio) {
        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .imageUrl(portfolio.getImageUrl())
                .title(portfolio.getTitle())
                .description(portfolio.getDescription())
                .displayOrder(portfolio.getDisplayOrder())
                .build();
    }
}
