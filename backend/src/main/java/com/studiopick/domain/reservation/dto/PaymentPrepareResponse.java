package com.studiopick.domain.reservation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentPrepareResponse {

    private String orderId;
    private String orderName;
    private Integer amount;
    private Long reservationId;
}
