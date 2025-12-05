package com.studiopick.domain.review.dto;

import com.studiopick.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewResponse {

    private Long id;
    private UserInfo user;
    private Integer rating;
    private String content;
    private List<String> images;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class UserInfo {
        private Long id;
        private String name;
    }

    public static ReviewResponse from(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .user(UserInfo.builder()
                        .id(review.getUser().getId())
                        .name(review.getUser().getName())
                        .build())
                .rating(review.getRating())
                .content(review.getContent())
                .images(review.getImages())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
