package com.studiopick.domain.studio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StudioSignupRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다")
    private String password;

    @NotBlank(message = "사업자명(상호)은 필수입니다")
    private String businessName;

    @NotBlank(message = "대표자명은 필수입니다")
    private String ownerName;

    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    @NotBlank(message = "사업자등록번호는 필수입니다")
    @Pattern(regexp = "^\\d{3}-?\\d{2}-?\\d{5}$", message = "올바른 사업자등록번호 형식이 아닙니다")
    private String businessNumber;
}
