package com.studiopick.domain.comment;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.user.entity.User;
import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comments")
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_id", nullable = false)
    private Studio studio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int rating; // 1-5 별점

    @Column(nullable = false, updatable = false)
    private String createdBy;

    @Column(nullable = false)
    private String modifiedBy;

    @Builder
    public Comment(Studio studio, User user, String content, int rating, String createdBy) {
        this.studio = studio;
        this.user = user;
        this.content = content;
        this.rating = rating;
        this.createdBy = createdBy;
        this.modifiedBy = createdBy;
    }

    public void update(String content, int rating, String modifiedBy) {
        this.content = content;
        this.rating = rating;
        this.modifiedBy = modifiedBy;
    }
}
