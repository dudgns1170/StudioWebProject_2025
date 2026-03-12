package com.studiopick.domain.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentWebhookRequest {

    @NotBlank(message = "eventType은 필수입니다")
    private String eventType;

    @NotBlank(message = "orderId는 필수입니다")
    private String orderId;

    private String paymentKey;

    @NotBlank(message = "status는 필수입니다")
    private String status;

    @NotNull(message = "amount는 필수입니다")
    private Integer amount;
}
