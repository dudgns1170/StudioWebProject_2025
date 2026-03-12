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
import com.studiopick.domain.location.Location;
import com.studiopick.domain.location.LocationRepository;
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
    private final LocationRepository locationRepository;
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
        
        // 0. 위치 데이터 초기화
        initializeLocationData();
        System.out.println("위치 데이터 초기화 완료");

        // 1. 일반 회원 생성
        User user1 = createUser("user1@example.com", "test1234", "김철수", "010-1234-5678");
        User user2 = createUser("user2@example.com", "test1234", "이영희", "010-9876-5432");
        User user3 = createUser("user3@example.com", "test1234", "박민준", "010-1111-2222");
        User user4 = createUser("user4@example.com", "test1234", "최지우", "010-3333-4444");
        User user5 = createUser("user5@example.com", "test1234", "정서연", "010-5555-6666");
        System.out.println("일반 회원 5명 생성 완료");

        // 2. 기업 회원 (Studio) 생성
        Studio studio1 = createStudio("studio1@example.com", "test1234", "스냅스튜디오", "박사장", "031-123-4567", "123-45-67890");
        Studio studio2 = createStudio("studio2@example.com", "test1234", "포토라운지", "최대표", "031-987-6543", "987-65-43210");
        Studio studio3 = createStudio("studio3@example.com", "test1234", "프레임스튜디오", "정사장", "031-555-7777", "555-77-88990");
        Studio studio4 = createStudio("studio4@example.com", "test1234", "브라이트스냅", "김감독", "02-1234-5678", "111-22-33344");
        Studio studio5 = createStudio("studio5@example.com", "test1234", "모먼트스튜디오", "이작가", "02-9999-8888", "222-33-44455");
        Studio studio6 = createStudio("studio6@example.com", "test1234", "포커스존", "한사장", "031-777-8888", "333-44-55566");
        System.out.println("기업 회원 6개 생성 완료");

        // 3. 스튜디오 프로필 생성 (각 스튜디오별 다양한 썸네일)
        StudioProfile profile1 = createStudioProfile(studio1, "스냅스튜디오 수원점",
                "자연스러운 프로필 촬영 전문 스튜디오입니다. 다양한 배경과 소품으로 개성있는 사진을 찍어드립니다.",
                "경기도 수원시 팔달구 인계로 123", "수원시", "팔달구",
                30000, 50000, 37.2636, 127.0286,
                Arrays.asList(StudioProfile.ShootingType.PORTRAIT, StudioProfile.ShootingType.FAMILY),
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"); // 스튜디오 인테리어

        StudioProfile profile2 = createStudioProfile(studio2, "포토라운지 성남점",
                "모던한 인테리어와 최신 장비로 트렌디한 사진을 제공합니다. 웨딩, 돌잔치 전문.",
                "경기도 성남시 분당구 판교역로 456", "성남시", "분당구",
                50000, 100000, 37.3955, 127.1110,
                Arrays.asList(StudioProfile.ShootingType.WEDDING, StudioProfile.ShootingType.FAMILY, StudioProfile.ShootingType.COUPLE),
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"); // 웨딩 이미지

        StudioProfile profile3 = createStudioProfile(studio3, "프레임스튜디오 용인점",
                "증명사진 당일 수령 가능! 빠르고 깔끔한 증명사진 전문점입니다.",
                "경기도 용인시 수지구 디지털밸리로 789", "용인시", "수지구",
                10000, 30000, 37.3217, 127.0894,
                Arrays.asList(StudioProfile.ShootingType.PORTRAIT, StudioProfile.ShootingType.GRADUATION),
                "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800"); // 여성 증명사진

        StudioProfile profile4 = createStudioProfile(studio4, "브라이트스냅 강남점",
                "트렌디한 바디프로필 전문 스튜디오입니다. 건강한 몸매를 가장 아름답게 담아드립니다.",
                "서울시 강남구 테헤란로 123", "서울시", "강남구",
                100000, 200000, 37.5048, 127.0254,
                Arrays.asList(StudioProfile.ShootingType.PORTRAIT, StudioProfile.ShootingType.COUPLE),
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"); // 바디프로필

        StudioProfile profile5 = createStudioProfile(studio5, "모먼트스튜디오 홍대점",
                "자유로운 분위기에서 편안한 촬영을 원하신다면! 커플, 우정사진 전문.",
                "서울시 마포구 홍익로 456", "서울시", "마포구",
                40000, 80000, 37.5570, 126.9244,
                Arrays.asList(StudioProfile.ShootingType.COUPLE, StudioProfile.ShootingType.FAMILY),
                "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800"); // 커플 사진

        StudioProfile profile6 = createStudioProfile(studio6, "포커스존 안양점",
                "졸업사진, 가족사진 전문. 20년 경력의 노하우로 특별한 순간을 담아드립니다.",
                "경기도 안양시 동안구 관악대로 789", "안양시", "동안구",
                30000, 60000, 37.3947, 126.9568,
                Arrays.asList(StudioProfile.ShootingType.GRADUATION, StudioProfile.ShootingType.FAMILY),
                "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"); // 가족 사진
        System.out.println("스튜디오 프로필 6개 생성 완료");

        // 4. 포트폴리오 생성
        createPortfolio(studio1, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "자연스러운 프로필 샘플", "부드러운 자연광 촬영", 1);
        createPortfolio(studio1, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", "가족 사진 샘플", "따뜻한 가족 촬영", 2);
        createPortfolio(studio1, "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800", "프로필 사진 샘플", "전문적인 프로필", 3);
        createPortfolio(studio2, "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "웨딩 촬영 샘플", "로맨틱 웨딩 스냅", 1);
        createPortfolio(studio2, "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", "돌잔치 촬영 샘플", "행복한 첫 생일", 2);
        createPortfolio(studio2, "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", "야외 웨딩 샘플", "자연스러운 야외 웨딩", 3);
        createPortfolio(studio3, "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800", "증명사진 샘플", "깔끔한 증명사진", 1);
        createPortfolio(studio3, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", "여권사진 샘플", "규격에 맞는 여권사진", 2);
        createPortfolio(studio4, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "바디프로필 샘플 1", "건강미 넘치는 바디프로필", 1);
        createPortfolio(studio4, "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800", "바디프로필 샘플 2", "근육 라인 강조 촬영", 2);
        createPortfolio(studio4, "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800", "커플 프로필", "커플 바디프로필", 3);
        createPortfolio(studio5, "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800", "커플 사진 샘플", "자연스러운 커플 스냅", 1);
        createPortfolio(studio5, "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800", "우정 사진 샘플", "친구들과의 추억", 2);
        createPortfolio(studio6, "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", "졸업 사진 샘플", "학사모와 함께", 1);
        createPortfolio(studio6, "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800", "가족 사진 샘플", "3대가 함께", 2);
        System.out.println("포트폴리오 15개 생성 완료");

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

        Reservation reservation4 = createReservation(user3, studio1, LocalDate.now().minusDays(14), "오후",
                StudioProfile.ShootingType.FAMILY, "{\"retouch\": true}",
                "가족사진 촬영 완료", Reservation.ReservationStatus.COMPLETED);

        Reservation reservation5 = createReservation(user4, studio2, LocalDate.now().minusDays(21), "오전",
                StudioProfile.ShootingType.WEDDING, "{\"makeup\": true, \"retouch\": true}",
                "웨딩 촬영 완료", Reservation.ReservationStatus.COMPLETED);

        Reservation reservation6 = createReservation(user5, studio4, LocalDate.now().minusDays(10), "오후",
                StudioProfile.ShootingType.PORTRAIT, "{\"retouch\": true}",
                "바디프로필 촬영 완료", Reservation.ReservationStatus.COMPLETED);

        Reservation reservation7 = createReservation(user2, studio5, LocalDate.now().minusDays(5), "오전",
                StudioProfile.ShootingType.COUPLE, "{\"retouch\": false}",
                "커플 사진 촬영 완료", Reservation.ReservationStatus.COMPLETED);

        Reservation reservation8 = createReservation(user3, studio6, LocalDate.now().minusDays(3), "오후",
                StudioProfile.ShootingType.GRADUATION, "{\"express\": false}",
                "졸업 사진 촬영 완료", Reservation.ReservationStatus.COMPLETED);
        System.out.println("예약 8개 생성 완료");

        // 6. 후기 생성 (완료된 예약에 대해서만)
        createReview(user1, studio3, reservation3, 5,
                "증명사진 정말 잘 나왔어요! 친절하시고 빠르게 받을 수 있어서 좋았습니다. 다음에도 꼭 여기서 찍을게요!",
                Arrays.asList("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"));
        profile3.updateRating(5.0, 1);

        createReview(user3, studio1, reservation4, 5,
                "가족사진 찍으러 갔는데 사장님이 정말 친절하셨어요. 아이들 다루는 것도 능숙하시고 사진도 이쁘게 나왔습니다!",
                Arrays.asList("https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400", "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=400"));
        profile1.updateRating(5.0, 1);

        createReview(user4, studio2, reservation5, 4,
                "웨딩 촬영 잘 받았습니다. 야외 촬영도 포함되어서 좋았어요. 다만 비가 와서 일정 변경이 있었지만 잘 대응해주셨습니다.",
                Arrays.asList("https://images.unsplash.com/photo-1519741497674-611481863552?w=400"));
        profile2.updateRating(4.0, 1);

        createReview(user5, studio4, reservation6, 5,
                "바디프로필 처음인데 긴장 풀어주시면서 잘 찍어주셨어요! 결과물 대만족입니다. 운동 더 열심히 해서 또 오고 싶어요.",
                Arrays.asList("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"));
        profile4.updateRating(5.0, 1);

        createReview(user2, studio5, reservation7, 4,
                "커플 사진 자연스럽게 잘 나왔어요. 분위기도 편안하고 좋았습니다. 가격대비 만족스러워요!",
                Arrays.asList("https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400"));
        profile5.updateRating(4.0, 1);

        createReview(user3, studio6, reservation8, 5,
                "졸업사진 20년 경력 답게 정말 잘 찍어주셨어요. 보정도 꼼꼼히 해주시고 학교 규격에도 딱 맞게 나왔습니다.",
                Arrays.asList("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400"));
        profile6.updateRating(5.0, 1);

        System.out.println("후기 6개 생성 완료");

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
                                               List<StudioProfile.ShootingType> shootingTypes,
                                               String thumbnailUrl) {
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
                .thumbnailUrl(thumbnailUrl)
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
    
    private void initializeLocationData() {
        // 서울특별시 데이터 (일부)
        List<String[]> seoulData = Arrays.asList(
            new String[]{"서울특별시", "강남구", "역삼동"},
            new String[]{"서울특별시", "강남구", "강남동"},
            new String[]{"서울특별시", "강남구", "개포동"},
            new String[]{"서울특별시", "강남구", "삼성동"},
            new String[]{"서울특별시", "강남구", "대치동"},
            new String[]{"서울특별시", "강동구", "강일동"},
            new String[]{"서울특별시", "강동구", "고덕동"},
            new String[]{"서울특별시", "강북구", "미아동"},
            new String[]{"서울특별시", "강북구", "삼양동"},
            new String[]{"서울특별시", "강서구", "가양동"},
            new String[]{"서울특별시", "강서구", "공항동"},
            new String[]{"서울특별시", "관악구", "신림동"},
            new String[]{"서울특별시", "관악구", "낙성대동"},
            new String[]{"서울특별시", "광진구", "광장동"},
            new String[]{"서울특별시", "광진구", "자양동"},
            new String[]{"서울특별시", "구로구", "구로동"},
            new String[]{"서울특별시", "구로구", "고척동"},
            new String[]{"서울특별시", "금천구", "가산동"},
            new String[]{"서울특별시", "금천구", "독산동"},
            new String[]{"서울특별시", "노원구", "월계동"},
            new String[]{"서울특별시", "노원구", "공릉동"},
            new String[]{"서울특별시", "도봉구", "쌍문동"},
            new String[]{"서울특별시", "도봉구", "방학동"},
            new String[]{"서울특별시", "동대문구", "용신동"},
            new String[]{"서울특별시", "동대문구", "제기동"},
            new String[]{"서울특별시", "동작구", "노량진동"},
            new String[]{"서울특별시", "동작구", "상도동"},
            new String[]{"서울특별시", "마포구", "공덕동"},
            new String[]{"서울특별시", "마포구", "아현동"},
            new String[]{"서울특별시", "마포구", "합정동"},
            new String[]{"서울특별시", "마포구", "연남동"},
            new String[]{"서울특별시", "서대문구", "천연동"},
            new String[]{"서울특별시", "서대문구", "북아현동"},
            new String[]{"서울특별시", "서초구", "서초동"},
            new String[]{"서울특별시", "서초구", "교대동"},
            new String[]{"서울특별시", "서초구", "방배동"},
            new String[]{"서울특별시", "성동구", "왕십리동"},
            new String[]{"서울특별시", "성동구", "성수동"},
            new String[]{"서울특별시", "성북구", "성북동"},
            new String[]{"서울특별시", "성북구", "삼선동"},
            new String[]{"서울특별시", "송파구", "잠실동"},
            new String[]{"서울특별시", "송파구", "문정동"},
            new String[]{"서울특별시", "송파구", "가락동"},
            new String[]{"서울특별시", "양천구", "목동"},
            new String[]{"서울특별시", "양천구", "신월동"},
            new String[]{"서울특별시", "영등포구", "영등포동"},
            new String[]{"서울특별시", "영등포구", "여의동"},
            new String[]{"서울특별시", "용산구", "후암동"},
            new String[]{"서울특별시", "용산구", "이촌동"},
            new String[]{"서울특별시", "은평구", "녹번동"},
            new String[]{"서울특별시", "은평구", "불광동"},
            new String[]{"서울특별시", "종로구", "사직동"},
            new String[]{"서울특별시", "종로구", "삼청동"},
            new String[]{"서울특별시", "중구", "소공동"},
            new String[]{"서울특별시", "중구", "회현동"},
            new String[]{"서울특별시", "중랑구", "면목동"},
            new String[]{"서울특별시", "중랑구", "상봉동"}
        );

        // 부산광역시 데이터 (일부)
        List<String[]> busanData = Arrays.asList(
            new String[]{"부산광역시", "해운대구", "우동"},
            new String[]{"부산광역시", "해운대구", "중동"},
            new String[]{"부산광역시", "해운대구", "좌동"},
            new String[]{"부산광역시", "해운대구", "송정동"},
            new String[]{"부산광역시", "남구", "대연동"},
            new String[]{"부산광역시", "남구", "문현동"}
        );

        // 데이터 저장
        seoulData.forEach(data -> {
            Location location = Location.builder()
                    .city(data[0])
                    .district(data[1])
                    .dong(data[2])
                    .build();
            locationRepository.save(location);
        });

        busanData.forEach(data -> {
            Location location = Location.builder()
                    .city(data[0])
                    .district(data[1])
                    .dong(data[2])
                    .build();
            locationRepository.save(location);
        });
    }
}
