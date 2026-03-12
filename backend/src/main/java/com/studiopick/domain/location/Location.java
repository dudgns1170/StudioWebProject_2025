package com.studiopick.domain.location;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String city; // 시/도

    @Column(nullable = false, length = 50)
    private String district; // 시/군/구

    @Column(nullable = false, length = 50)
    private String dong; // 동/읍/면

    @Builder
    public Location(String city, String district, String dong) {
        this.city = city;
        this.district = district;
        this.dong = dong;
    }
}
