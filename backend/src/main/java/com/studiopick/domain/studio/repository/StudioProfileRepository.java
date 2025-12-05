package com.studiopick.domain.studio.repository;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudioProfileRepository extends JpaRepository<StudioProfile, Long> {

    Optional<StudioProfile> findByStudio(Studio studio);

    Optional<StudioProfile> findByStudioId(Long studioId);

    /**
     * 승인된 스튜디오 프로필 목록 조회 (필터링)
     */
    @Query("SELECT p FROM StudioProfile p JOIN p.studio s WHERE " +
            "s.status = 'APPROVED' AND " +
            "(:city IS NULL OR p.city = :city) AND " +
            "(:minPrice IS NULL OR p.minPrice >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.minPrice <= :maxPrice)")
    Page<StudioProfile> findByFilters(
            @Param("city") String city,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            Pageable pageable
    );

    /**
     * 승인된 스튜디오 프로필 목록 조회 (촬영종류 필터 포함)
     */
    @Query("SELECT DISTINCT p FROM StudioProfile p JOIN p.studio s JOIN p.shootingTypes st WHERE " +
            "s.status = 'APPROVED' AND " +
            "(:city IS NULL OR p.city = :city) AND " +
            "(:shootingType IS NULL OR st = :shootingType) AND " +
            "(:minPrice IS NULL OR p.minPrice >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.minPrice <= :maxPrice)")
    Page<StudioProfile> findByFiltersWithShootingType(
            @Param("city") String city,
            @Param("shootingType") StudioProfile.ShootingType shootingType,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            Pageable pageable
    );
}
