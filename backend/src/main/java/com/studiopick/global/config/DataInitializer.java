package com.studiopick.global.config;

import com.studiopick.domain.portfolio.entity.Portfolio;
import com.studiopick.domain.portfolio.repository.PortfolioRepository;
import com.studiopick.domain.reservation.entity.Reservation;
import com.studiopick.domain.reservation.repository.ReservationRepository;
import com.studiopick.domain.review.entity.Review;
import com.studiopick.domain.review.repository.ReviewRepository;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.entity.StudioProfile;
import com.studiopick.domain.studio.repository.StudioProfileRepository;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * 개발 환경용 테스트 데이터 초기화
 * - 비밀번호: test1234
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final StudioRepository studioRepository;
    private final StudioProfileRepository studioProfileRepository;
    private final PortfolioRepository portfolioRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // 이미 데이터가 있으면 스킵
        if (userRepository.count() > 0) {
            System.out.println("테스트 데이터가 이미 존재합니다. 초기화를 스킵합니다.");
            return;
        }

        System.out.println("========== 테스트 데이터 초기화 시작 ==========");

        // 1. 일반 회원 생성
        User user1 = createUser("user1@example.com", "test1234", "김철수", "010-1234-5678");
        User user2 = createUser("user2@example.com", "test1234", "이영희", "010-9876-5432");
        System.out.println("일반 회원 2명 생성 완료");

        // 2. 기업 회원 (Studio) 생성
        Studio studio1 = createStudio("studio1@example.com", "test1234", "스냅스튜디오", "박사장", "031-123-4567", "123-45-67890");
        Studio studio2 = createStudio("studio2@example.com", "test1234", "포토라운지", "최대표", "031-987-6543", "987-65-43210");
        Studio studio3 = createStudio("studio3@example.com", "test1234", "프레임스튜디오", "정사장", "031-555-7777", "555-77-88990");
        System.out.println("기업 회원 3개 생성 완료");

        // 3. 스튜디오 프로필 생성
        StudioProfile profile1 = createStudioProfile(studio1, "스냅스튜디오 수원점",
                "자연스러운 프로필 촬영 전문 스튜디오입니다. 다양한 배경과 소품으로 개성있는 사진을 찍어드립니다.",
                "경기도 수원시 팔달구 인계로 123", "수원시", "팔달구",
                30000, 50000, 37.2636, 127.0286,
                Arrays.asList(StudioProfile.ShootingType.PORTRAIT, StudioProfile.ShootingType.FAMILY));

        StudioProfile profile2 = createStudioProfile(studio2, "포토라운지 성남점",
                "모던한 인테리어와 최신 장비로 트렌디한 사진을 제공합니다. 웨딩, 돌잔치 전문.",
                "경기도 성남시 분당구 판교역로 456", "성남시", "분당구",
                50000, 100000, 37.3955, 127.1110,
                Arrays.asList(StudioProfile.ShootingType.WEDDING, StudioProfile.ShootingType.FAMILY, StudioProfile.ShootingType.COUPLE));

        StudioProfile profile3 = createStudioProfile(studio3, "프레임스튜디오 용인점",
                "증명사진 당일 수령 가능! 빠르고 깔끔한 증명사진 전문점입니다.",
                "경기도 용인시 수지구 디지털밸리로 789", "용인시", "수지구",
                10000, 30000, 37.3217, 127.0894,
                Arrays.asList(StudioProfile.ShootingType.PORTRAIT, StudioProfile.ShootingType.GRADUATION));
        System.out.println("스튜디오 프로필 3개 생성 완료");

        // 4. 포트폴리오 생성
        createPortfolio(studio1, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "자연스러운 프로필 샘플", "부드러운 자연광 촬영", 1);
        createPortfolio(studio1, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", "가족 사진 샘플", "따뜻한 가족 촬영", 2);
        createPortfolio(studio1, "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800", "프로필 사진 샘플", "전문적인 프로필", 3);
        createPortfolio(studio2, "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "웨딩 촬영 샘플", "로맨틱 웨딩 스냅", 1);
        createPortfolio(studio2, "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", "돌잔치 촬영 샘플", "행복한 첫 생일", 2);
        createPortfolio(studio3, "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800", "증명사진 샘플", "깔끔한 증명사진", 1);
        createPortfolio(studio3, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", "여권사진 샘플", "규격에 맞는 여권사진", 2);
        System.out.println("포트폴리오 7개 생성 완료");

        // 5. 예약 생성
        Reservation reservation1 = createReservation(user1, studio1, LocalDate.now().plusDays(7), "오전",
                StudioProfile.ShootingType.PORTRAIT, "{\"makeup\": false, \"retouch\": true}",
                "자연스러운 느낌으로 부탁드립니다.", Reservation.ReservationStatus.PENDING);

        Reservation reservation2 = createReservation(user2, studio2, LocalDate.now().plusDays(14), "오후",
                StudioProfile.ShootingType.WEDDING, "{\"makeup\": true, \"retouch\": true}",
                "웨딩 스냅 촬영 원합니다.", Reservation.ReservationStatus.APPROVED);

        Reservation reservation3 = createReservation(user1, studio3, LocalDate.now().minusDays(7), "오전",
                StudioProfile.ShootingType.PORTRAIT, "{\"express\": true}",
                "증명사진 촬영 완료", Reservation.ReservationStatus.COMPLETED);
        System.out.println("예약 3개 생성 완료");

        // 6. 후기 생성 (완료된 예약에 대해서만)
        createReview(user1, studio3, reservation3, 5,
                "증명사진 정말 잘 나왔어요! 친절하시고 빠르게 받을 수 있어서 좋았습니다. 다음에도 꼭 여기서 찍을게요!",
                Arrays.asList("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"));

        // profile3의 rating 업데이트
        profile3.updateRating(5.0, 1);
        System.out.println("후기 1개 생성 완료");

        System.out.println("========== 테스트 데이터 초기화 완료 ==========");
        System.out.println("테스트 계정:");
        System.out.println("  - 일반회원: user1@example.com / test1234");
        System.out.println("  - 일반회원: user2@example.com / test1234");
        System.out.println("  - 기업회원: studio1@example.com / test1234");
        System.out.println("  - 기업회원: studio2@example.com / test1234");
        System.out.println("  - 기업회원: studio3@example.com / test1234");
    }

    private User createUser(String email, String password, String name, String phone) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .name(name)
                .phone(phone)
                .build();
        return userRepository.save(user);
    }

    private Studio createStudio(String email, String password, String businessName,
                                 String ownerName, String phone, String businessNumber) {
        Studio studio = Studio.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .businessName(businessName)
                .ownerName(ownerName)
                .phone(phone)
                .businessNumber(businessNumber)
                .status(Studio.StudioStatus.APPROVED)
                .build();
        return studioRepository.save(studio);
    }

    private StudioProfile createStudioProfile(Studio studio, String name, String description,
                                               String address, String city, String district,
                                               Integer minPrice, Integer maxPrice,
                                               double lat, double lng,
                                               List<StudioProfile.ShootingType> shootingTypes) {
        StudioProfile profile = StudioProfile.builder()
                .studio(studio)
                .name(name)
                .description(description)
                .address(address)
                .city(city)
                .district(district)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .latitude(BigDecimal.valueOf(lat))
                .longitude(BigDecimal.valueOf(lng))
                .shootingTypes(shootingTypes)
                .rating(4.5)
                .reviewCount(0)
                .operatingHours("10:00 - 19:00")
                .thumbnailUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800")
                .build();
        return studioProfileRepository.save(profile);
    }

    private Portfolio createPortfolio(Studio studio, String imageUrl, String title,
                                       String description, int displayOrder) {
        Portfolio portfolio = Portfolio.builder()
                .studio(studio)
                .imageUrl(imageUrl)
                .title(title)
                .description(description)
                .displayOrder(displayOrder)
                .build();
        return portfolioRepository.save(portfolio);
    }

    private Reservation createReservation(User user, Studio studio, LocalDate preferredDate,
                                           String preferredTime, StudioProfile.ShootingType shootingType,
                                           String options, String message,
                                           Reservation.ReservationStatus status) {
        Reservation reservation = Reservation.builder()
                .user(user)
                .studio(studio)
                .preferredDate(preferredDate)
                .preferredTime(preferredTime)
                .shootingType(shootingType)
                .options(options)
                .message(message)
                .status(status)
                .build();
        return reservationRepository.save(reservation);
    }

    private Review createReview(User user, Studio studio, Reservation reservation,
                                 Integer rating, String content, List<String> images) {
        Review review = Review.builder()
                .user(user)
                .studio(studio)
                .reservation(reservation)
                .rating(rating)
                .content(content)
                .images(images)
                .build();
        return reviewRepository.save(review);
    }
}
