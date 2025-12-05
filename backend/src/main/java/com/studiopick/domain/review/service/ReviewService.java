package com.studiopick.domain.review.service;

import com.studiopick.domain.reservation.entity.Reservation;
import com.studiopick.domain.reservation.repository.ReservationRepository;
import com.studiopick.domain.review.dto.ReviewCreateRequest;
import com.studiopick.domain.review.dto.ReviewResponse;
import com.studiopick.domain.review.entity.Review;
import com.studiopick.domain.review.repository.ReviewRepository;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.studio.repository.StudioProfileRepository;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import com.studiopick.infra.s3.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final StudioProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewCreateRequest request, List<MultipartFile> images) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        if (reservation.getStatus() != Reservation.ReservationStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.RESERVATION_NOT_COMPLETED);
        }

        if (reviewRepository.existsByReservationId(request.getReservationId())) {
            throw new BusinessException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                imageUrls.add(s3Service.uploadFile(image, "review"));
            }
        }

        Review review = Review.builder()
                .user(user)
                .studio(reservation.getStudio())
                .reservation(reservation)
                .rating(request.getRating())
                .content(request.getContent())
                .images(imageUrls)
                .build();

        Review savedReview = reviewRepository.save(review);

        updateStudioProfileRating(reservation.getStudio().getId());

        return ReviewResponse.from(savedReview);
    }

    public List<ReviewResponse> getStudioReviews(Long studioId) {
        return reviewRepository.findByStudioIdOrderByCreatedAtDesc(studioId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewCreateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        review.update(request.getRating(), request.getContent(), review.getImages());

        updateStudioProfileRating(review.getStudio().getId());

        return ReviewResponse.from(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        Long studioId = review.getStudio().getId();

        for (String imageUrl : review.getImages()) {
            s3Service.deleteFile(imageUrl);
        }

        reviewRepository.delete(review);

        updateStudioProfileRating(studioId);
    }

    private void updateStudioProfileRating(Long studioId) {
        StudioProfile profile = profileRepository.findByStudioId(studioId)
                .orElse(null);

        if (profile != null) {
            Double avgRating = reviewRepository.getAverageRatingByStudioId(studioId);
            Integer reviewCount = reviewRepository.getReviewCountByStudioId(studioId);
            profile.updateRating(avgRating != null ? avgRating : 0.0, reviewCount != null ? reviewCount : 0);
        }
    }
}
