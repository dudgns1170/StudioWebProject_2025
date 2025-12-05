package com.studiopick.domain.portfolio.repository;

import com.studiopick.domain.portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByStudioIdOrderByDisplayOrderAsc(Long studioId);

    void deleteByStudioId(Long studioId);
}
