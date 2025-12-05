package com.studiopick.domain.portfolio.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PortfolioCreateRequest {

    private String title;
    private String description;
    private Integer displayOrder;
}
