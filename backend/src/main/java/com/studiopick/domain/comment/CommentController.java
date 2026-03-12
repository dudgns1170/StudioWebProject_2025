package com.studiopick.domain.comment;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.service.StudioService;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import com.studiopick.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final StudioService studioService;
    private final UserRepository userRepository;

    @GetMapping("/studios/{studioId}")
    public ResponseEntity<List<Comment>> getCommentsByStudio(@PathVariable Long studioId) {
        List<Comment> comments = commentService.getCommentsByStudio(studioId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/studios/{studioId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long studioId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Studio studio = studioService.findById(studioId);
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Comment comment = commentService.createComment(
                studio, 
                user, 
                request.getContent(), 
                request.getRating(),
                user.getName()
        );
        
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // TODO: 권한 확인 로직 추가 필요
        
        Comment comment = commentService.updateComment(
                commentId,
                request.getContent(),
                request.getRating(),
                userDetails.getUsername()
        );
        
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // TODO: 권한 확인 로직 추가 필요
        
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    public static class CommentRequest {
        private String content;
        private int rating;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public int getRating() {
            return rating;
        }

        public void setRating(int rating) {
            this.rating = rating;
        }
    }
}
