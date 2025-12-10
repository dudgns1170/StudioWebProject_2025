package com.studiopick.domain.auth.service;

import com.studiopick.domain.auth.dto.LoginRequest;
import com.studiopick.domain.auth.dto.LoginResponse;
import com.studiopick.domain.auth.dto.RefreshRequest;
import com.studiopick.domain.auth.dto.StudioLoginResponse;
import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.domain.user.dto.UserResponse;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import com.studiopick.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final StudioRepository studioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 통합 로그인 - 이메일로 User/Studio 자동 구분
     */
    public Object login(LoginRequest request) {
        // 먼저 일반 회원에서 찾기
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            return loginUser(request);
        }

        // 기업 회원에서 찾기
        Optional<Studio> studioOpt = studioRepository.findByEmail(request.getEmail());
        if (studioOpt.isPresent()) {
            return loginStudio(request);
        }

        throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
    }

    /**
     * 일반 회원 로그인
     */
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtTokenProvider.createToken(user.getEmail(), user.getId(), "USER");
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .user(UserResponse.from(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * 기업 회원 로그인
     */
    public StudioLoginResponse loginStudio(LoginRequest request) {
        Studio studio = studioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), studio.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtTokenProvider.createToken(studio.getEmail(), studio.getId(), "STUDIO");
        String refreshToken = jwtTokenProvider.createRefreshToken(studio.getEmail());

        return StudioLoginResponse.builder()
                .studioId(studio.getId())
                .email(studio.getEmail())
                .businessName(studio.getBusinessName())
                .ownerName(studio.getOwnerName())
                .status(studio.getStatus().name())
                .role("STUDIO")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * 토큰 갱신
     */
    public Object refresh(RefreshRequest request) {
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        String email = jwtTokenProvider.getEmail(request.getRefreshToken());

        // 일반 회원 확인
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String accessToken = jwtTokenProvider.createToken(user.getEmail(), user.getId(), "USER");
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

            return LoginResponse.builder()
                    .user(UserResponse.from(user))
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }

        // 기업 회원 확인
        Optional<Studio> studioOpt = studioRepository.findByEmail(email);
        if (studioOpt.isPresent()) {
            Studio studio = studioOpt.get();
            String accessToken = jwtTokenProvider.createToken(studio.getEmail(), studio.getId(), "STUDIO");
            String refreshToken = jwtTokenProvider.createRefreshToken(studio.getEmail());

            return StudioLoginResponse.builder()
                    .studioId(studio.getId())
                    .email(studio.getEmail())
                    .businessName(studio.getBusinessName())
                    .ownerName(studio.getOwnerName())
                    .status(studio.getStatus().name())
                    .role("STUDIO")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }

        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    }
}
