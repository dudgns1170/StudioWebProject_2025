package com.studiopick.global.util;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

import java.util.regex.Pattern;

/**
 * XSS 공격 방어를 위한 입력값 정제 유틸리티
 */
@Component
public class XssSanitizer {

    // 위험한 HTML 태그 패턴
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern EVENT_PATTERN = Pattern.compile("on\\w+\\s*=", Pattern.CASE_INSENSITIVE);
    private static final Pattern JAVASCRIPT_PATTERN = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
    private static final Pattern IFRAME_PATTERN = Pattern.compile("<iframe[^>]*>.*?</iframe>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    /**
     * 문자열에서 XSS 위험 요소 제거
     */
    public String sanitize(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        String result = input;
        result = SCRIPT_PATTERN.matcher(result).replaceAll("");
        result = EVENT_PATTERN.matcher(result).replaceAll("");
        result = JAVASCRIPT_PATTERN.matcher(result).replaceAll("");
        result = IFRAME_PATTERN.matcher(result).replaceAll("");

        return HtmlUtils.htmlEscape(result);
    }

    /**
     * HTML 태그만 제거 (이스케이프 없이)
     */
    public String stripHtml(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.replaceAll("<[^>]*>", "");
    }

    /**
     * SQL Injection 위험 문자 검사
     */
    public boolean containsSqlInjection(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }

        String lowerInput = input.toLowerCase();
        String[] sqlKeywords = {
            "' or ", "' and ", "'; drop", "'; delete", "'; update", "'; insert",
            "union select", "union all select", "--", "/*", "*/"
        };

        for (String keyword : sqlKeywords) {
            if (lowerInput.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
