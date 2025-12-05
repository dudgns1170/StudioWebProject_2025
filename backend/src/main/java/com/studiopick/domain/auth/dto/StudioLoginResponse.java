package com.studiopick.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 기업 회원 로그인 응답 DTO
 */
@Getter
@Builder
public class StudioLoginResponse {

    private Long studioId;
    private String email;
    private String businessName;
    private String ownerName;
    private String status;
    private String role;
    private String accessToken;
    private String refreshToken;
}
