package com.studiopick.domain.auth.dto;

import com.studiopick.domain.user.dto.UserResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private UserResponse user;
    private String accessToken;
    private String refreshToken;
}
