package com.studiopick.domain.comment;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> getCommentsByStudio(Long studioId) {
        return commentRepository.findByStudioIdOrderByCreatedAtDesc(studioId);
    }

    @Transactional
    public Comment createComment(Studio studio, User user, String content, int rating, String username) {
        Comment comment = Comment.builder()
                .studio(studio)
                .user(user)
                .content(content)
                .rating(rating)
                .createdBy(username)
                .build();

        Comment savedComment = commentRepository.save(comment);
        updateStudioRating(studio.getId());
        
        return savedComment;
    }

    @Transactional
    public Comment updateComment(Long commentId, String content, int rating, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
        
        comment.update(content, rating, username);
        updateStudioRating(comment.getStudio().getId());
        
        return comment;
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
        
        Long studioId = comment.getStudio().getId();
        commentRepository.delete(comment);
        updateStudioRating(studioId);
    }

    private void updateStudioRating(Long studioId) {
        Double avgRating = commentRepository.findAverageRatingByStudioId(studioId);
        Long reviewCount = commentRepository.countByStudioId(studioId);
        
        if (avgRating == null) {
            avgRating = 0.0;
        }
        
        // TODO: StudioProfile 업데이트 로직 구현 필요
    }
}
