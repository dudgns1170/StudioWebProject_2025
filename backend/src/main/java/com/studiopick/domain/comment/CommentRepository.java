package com.studiopick.domain.comment;

import com.studiopick.domain.studio.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByStudioIdOrderByCreatedAtDesc(Long studioId);

    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.studio.id = :studioId")
    Double findAverageRatingByStudioId(@Param("studioId") Long studioId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.studio.id = :studioId")
    Long countByStudioId(@Param("studioId") Long studioId);
}
