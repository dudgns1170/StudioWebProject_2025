package com.studiopick.global.security;

import com.studiopick.domain.studio.entity.Studio;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * 기업 회원 (Studio) 인증 정보
 */
@Getter
public class CustomStudioDetails implements UserDetails {

    private final Long studioId;
    private final String email;
    private final String password;
    private final Studio.StudioStatus status;

    public CustomStudioDetails(Studio studio) {
        this.studioId = studio.getId();
        this.email = studio.getEmail();
        this.password = studio.getPassword();
        this.status = studio.getStatus();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDIO"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == Studio.StudioStatus.APPROVED;
    }

    public boolean isApproved() {
        return status == Studio.StudioStatus.APPROVED;
    }
}
