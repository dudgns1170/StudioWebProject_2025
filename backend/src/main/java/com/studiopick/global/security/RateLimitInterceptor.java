package com.studiopick.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * API 호출 횟수 제한 인터셉터 (DDoS 방지)
 * - IP 기반으로 분당 요청 횟수 제한
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final long TIME_WINDOW_MS = 60_000; // 1분

    private final Map<String, RateLimitInfo> requestCounts = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);
        long currentTime = System.currentTimeMillis();

        RateLimitInfo info = requestCounts.compute(clientIp, (key, existing) -> {
            if (existing == null || currentTime - existing.windowStart > TIME_WINDOW_MS) {
                return new RateLimitInfo(currentTime, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });

        if (info.count.get() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"status\":false,\"code\":429,\"message\":\"rate_limit_exceeded\",\"data\":null}");
            return false;
        }

        // Rate Limit 헤더 추가
        response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(MAX_REQUESTS_PER_MINUTE - info.count.get()));

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    private static class RateLimitInfo {
        final long windowStart;
        final AtomicInteger count;

        RateLimitInfo(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
