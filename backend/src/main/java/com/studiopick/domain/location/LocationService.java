package com.studiopick.domain.location;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<String> getAllCities() {
        return locationRepository.findAllCities();
    }

    public List<String> getDistrictsByCity(String city) {
        return locationRepository.findDistrictsByCity(city);
    }

    public List<String> getDongsByCityAndDistrict(String city, String district) {
        return locationRepository.findDongsByCityAndDistrict(city, district);
    }

    @Transactional
    public Location createLocation(String city, String district, String dong) {
        Location location = Location.builder()
                .city(city)
                .district(district)
                .dong(dong)
                .build();
        
        return locationRepository.save(location);
    }
}
