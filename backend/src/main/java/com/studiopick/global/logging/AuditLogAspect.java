package com.studiopick.global.logging;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * 중요 API 호출에 대한 감사(Audit) 로깅
 * - 인증, 예약, 결제 등 중요 작업 추적
 */
@Aspect
@Component
@Slf4j
public class AuditLogAspect {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 인증 관련 API 감사 로깅
     */
    @Pointcut("execution(* com.studiopick.domain.auth.controller..*.*(..))")
    public void authOperations() {}

    /**
     * 예약 관련 API 감사 로깅
     */
    @Pointcut("execution(* com.studiopick.domain.reservation.controller..*.*(..))")
    public void reservationOperations() {}

    /**
     * 리뷰 작성/수정/삭제 감사 로깅
     */
    @Pointcut("execution(* com.studiopick.domain.review.controller..*.create*(..)) || " +
              "execution(* com.studiopick.domain.review.controller..*.update*(..)) || " +
              "execution(* com.studiopick.domain.review.controller..*.delete*(..))")
    public void reviewModifications() {}

    @Around("authOperations() || reservationOperations() || reviewModifications()")
    public Object auditLog(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String methodName = joinPoint.getSignature().toShortString();
        String userId = getCurrentUserId();
        String clientIp = getClientIp();

        log.info("[AUDIT] {} | User: {} | IP: {} | Method: {} | Args: {}",
                timestamp, userId, clientIp, methodName, maskSensitiveData(joinPoint.getArgs()));

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            log.info("[AUDIT] {} | User: {} | Method: {} | Status: SUCCESS | Duration: {}ms",
                    timestamp, userId, methodName, duration);

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;

            log.error("[AUDIT] {} | User: {} | Method: {} | Status: FAILED | Duration: {}ms | Error: {}",
                    timestamp, userId, methodName, duration, e.getMessage());

            throw e;
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "anonymous";
    }

    private String getClientIp() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            HttpServletRequest request = attrs.getRequest();
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        return "unknown";
    }

    /**
     * 민감한 데이터 마스킹 (비밀번호 등)
     */
    private String maskSensitiveData(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }

        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) return "null";
                    String str = arg.toString();
                    // 비밀번호 필드 마스킹
                    if (str.toLowerCase().contains("password")) {
                        return "[MASKED]";
                    }
                    // 긴 문자열 축약
                    if (str.length() > 100) {
                        return str.substring(0, 100) + "...";
                    }
                    return str;
                })
                .toList()
                .toString();
    }
}
