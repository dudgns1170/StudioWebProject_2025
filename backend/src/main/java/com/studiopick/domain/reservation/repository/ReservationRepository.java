package com.studiopick.domain.reservation.repository;

import com.studiopick.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Reservation> findByStudioIdOrderByCreatedAtDesc(Long studioId);
}
