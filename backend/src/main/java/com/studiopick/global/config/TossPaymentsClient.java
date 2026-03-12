package com.studiopick.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.studiopick.domain.reservation.dto.TossPaymentResponse;
import com.studiopick.domain.reservation.dto.TossPaymentConfirmRequest;
import com.studiopick.domain.reservation.dto.TossCancelRequest;

import java.util.Base64;

@Component
public class TossPaymentsClient {
    private final WebClient webClient;
    private final String tossSecretKey;
    
    public TossPaymentsClient(@Value("${toss.secret-key}") String tossSecretKey) {
        this.tossSecretKey = tossSecretKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.tosspayments.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + 
                    Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes()))
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }
    
    // 결제 승인 (멱등성 지원)
    public Mono<TossPaymentResponse> confirmPayment(TossPaymentConfirmRequest request) {
        return confirmPayment(request, null);
    }
    
    public Mono<TossPaymentResponse> confirmPayment(TossPaymentConfirmRequest request, String idempotencyKey) {
        WebClient.RequestBodySpec spec = webClient.post()
                .uri("/payments/confirm")
                .bodyValue(request);
        
        // 멱등키가 있으면 헤더에 추가
        if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
            spec.header("Idempotency-Key", idempotencyKey);
        }
        
        return spec.retrieve()
                .bodyToMono(TossPaymentResponse.class);
    }
    
    // 결제 조회
    public Mono<TossPaymentResponse> getPayment(String paymentKey) {
        return webClient.get()
                .uri("/payments/" + paymentKey)
                .retrieve()
                .bodyToMono(TossPaymentResponse.class);
    }
    
    // 결제 취소 (멱등성 지원)
    public Mono<TossPaymentResponse> cancelPayment(String paymentKey, TossCancelRequest request) {
        return cancelPayment(paymentKey, request, null);
    }
    
    public Mono<TossPaymentResponse> cancelPayment(String paymentKey, TossCancelRequest request, String idempotencyKey) {
        WebClient.RequestBodySpec spec = webClient.post()
                .uri("/payments/" + paymentKey + "/cancel")
                .bodyValue(request);
        
        // 멱등키가 있으면 헤더에 추가
        if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
            spec.header("Idempotency-Key", idempotencyKey);
        }
        
        return spec.retrieve()
                .bodyToMono(TossPaymentResponse.class);
    }
}
