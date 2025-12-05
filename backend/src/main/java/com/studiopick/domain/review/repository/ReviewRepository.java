package com.studiopick.domain.review.repository;

import com.studiopick.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByStudioIdOrderByCreatedAtDesc(Long studioId);

    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Review> findByReservationId(Long reservationId);

    boolean existsByReservationId(Long reservationId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.studio.id = :studioId")
    Double getAverageRatingByStudioId(@Param("studioId") Long studioId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.studio.id = :studioId")
    Integer getReviewCountByStudioId(@Param("studioId") Long studioId);
}
