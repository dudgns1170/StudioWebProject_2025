package com.studiopick.domain.auth.controller;

import com.studiopick.domain.auth.dto.LoginRequest;
import com.studiopick.domain.auth.dto.LoginResponse;
import com.studiopick.domain.auth.dto.RefreshRequest;
import com.studiopick.domain.auth.dto.StudioLoginResponse;
import com.studiopick.domain.auth.service.AuthService;
import com.studiopick.domain.studio.dto.StudioSignupRequest;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.service.StudioService;
import com.studiopick.domain.user.dto.UserSignupRequest;
import com.studiopick.domain.user.service.UserService;
import com.studiopick.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final StudioService studioService;

    @Operation(summary = "일반 회원가입")
    @PostMapping("/signup/user")
    public ResponseEntity<ApiResponse<Void>> signupUser(
            @Valid @RequestBody UserSignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.success(null, "회원가입이 완료되었습니다"));
    }

    @Operation(summary = "기업 회원가입")
    @PostMapping("/signup/studio")
    public ResponseEntity<ApiResponse<Void>> signupStudio(
            @Valid @RequestBody StudioSignupRequest request) {
        studioService.signup(request);
        return ResponseEntity.ok(ApiResponse.success(null, "회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다."));
    }

    @Operation(summary = "일반 회원 로그인")
    @PostMapping("/login/user")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.loginUser(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "기업 회원 로그인")
    @PostMapping("/login/studio")
    public ResponseEntity<ApiResponse<StudioLoginResponse>> loginStudio(
            @Valid @RequestBody LoginRequest request) {
        StudioLoginResponse response = authService.loginStudio(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "토큰 갱신")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Object>> refresh(
            @Valid @RequestBody RefreshRequest request) {
        Object response = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
