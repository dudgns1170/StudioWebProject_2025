package com.studiopick.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력입니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "서버 오류가 발생했습니다"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "C003", "접근 권한이 없습니다"),

    // Auth
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "A001", "이메일 또는 비밀번호가 올바르지 않습니다"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "A002", "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "A003", "만료된 토큰입니다"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다"),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U002", "이미 사용 중인 이메일입니다"),

    // Studio
    STUDIO_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "스튜디오를 찾을 수 없습니다"),
    DUPLICATE_BUSINESS_NUMBER(HttpStatus.CONFLICT, "S002", "이미 등록된 사업자등록번호입니다"),
    STUDIO_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "S003", "스튜디오 프로필을 찾을 수 없습니다"),
    STUDIO_PROFILE_ALREADY_EXISTS(HttpStatus.CONFLICT, "S004", "스튜디오 프로필이 이미 존재합니다"),
    STUDIO_NOT_APPROVED(HttpStatus.FORBIDDEN, "S005", "승인되지 않은 스튜디오입니다"),

    // Portfolio
    PORTFOLIO_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "포트폴리오를 찾을 수 없습니다"),

    // Reservation
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "예약을 찾을 수 없습니다"),
    RESERVATION_ALREADY_EXISTS(HttpStatus.CONFLICT, "R002", "해당 시간에 이미 예약이 있습니다"),
    RESERVATION_NOT_COMPLETED(HttpStatus.BAD_REQUEST, "R003", "완료된 예약만 후기를 작성할 수 있습니다"),

    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "V001", "후기를 찾을 수 없습니다"),
    REVIEW_ALREADY_EXISTS(HttpStatus.CONFLICT, "V002", "이미 후기를 작성했습니다"),

    // File
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "F001", "파일 업로드에 실패했습니다");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
