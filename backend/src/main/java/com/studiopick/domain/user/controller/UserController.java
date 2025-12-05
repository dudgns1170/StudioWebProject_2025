package com.studiopick.domain.user.controller;

import com.studiopick.domain.user.dto.UserResponse;
import com.studiopick.domain.user.service.UserService;
import com.studiopick.global.response.ApiResponse;
import com.studiopick.global.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "일반 회원 API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = userService.findById(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
