package com.studiopick.domain.user.entity;

import com.studiopick.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 일반 회원 엔티티
 * - 사진관 검색, 예약, 후기 작성 등을 하는 일반 사용자
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    public void updateProfile(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }
}
