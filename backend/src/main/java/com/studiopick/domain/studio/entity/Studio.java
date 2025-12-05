package com.studiopick.domain.studio.entity;

import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 기업 회원 (사진관 운영자) 엔티티
 * - 로그인/인증 정보를 관리
 * - StudioProfile과 1:1 관계
 */
@Entity
@Table(name = "studios")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Studio extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String businessName;  // 사업자명 (상호)

    @Column(nullable = false)
    private String ownerName;     // 대표자명

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String businessNumber; // 사업자등록번호

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StudioStatus status = StudioStatus.PENDING;

    @OneToOne(mappedBy = "studio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StudioProfile profile;

    public enum StudioStatus {
        PENDING,    // 승인 대기
        APPROVED,   // 승인됨
        REJECTED    // 거절됨
    }

    public void approve() {
        this.status = StudioStatus.APPROVED;
    }

    public void reject() {
        this.status = StudioStatus.REJECTED;
    }

    public void setProfile(StudioProfile profile) {
        this.profile = profile;
    }
}
