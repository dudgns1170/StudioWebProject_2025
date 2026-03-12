package com.studiopick.domain.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT DISTINCT l.city FROM Location l ORDER BY l.city")
    List<String> findAllCities();

    @Query("SELECT DISTINCT l.district FROM Location l WHERE l.city = :city ORDER BY l.district")
    List<String> findDistrictsByCity(String city);

    @Query("SELECT DISTINCT l.dong FROM Location l WHERE l.city = :city AND l.district = :district ORDER BY l.dong")
    List<String> findDongsByCityAndDistrict(String city, String district);
}
