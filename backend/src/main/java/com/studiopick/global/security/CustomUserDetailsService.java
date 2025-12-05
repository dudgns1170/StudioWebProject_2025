package com.studiopick.global.security;

import com.studiopick.domain.studio.entity.Studio;
import com.studiopick.domain.studio.repository.StudioRepository;
import com.studiopick.domain.user.entity.User;
import com.studiopick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 일반 회원(User) 및 기업 회원(Studio) 인증 서비스
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StudioRepository studioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 먼저 일반 회원에서 찾기
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return new CustomUserDetails(userOpt.get());
        }

        // 기업 회원에서 찾기
        Optional<Studio> studioOpt = studioRepository.findByEmail(email);
        if (studioOpt.isPresent()) {
            return new CustomStudioDetails(studioOpt.get());
        }

        throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
    }
}
