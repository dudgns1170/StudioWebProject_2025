package com.studiopick.domain.location;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<String> cities = locationService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistrictsByCity(@RequestParam String city) {
        List<String> districts = locationService.getDistrictsByCity(city);
        return ResponseEntity.ok(districts);
    }

    @GetMapping("/dongs")
    public ResponseEntity<List<String>> getDongsByCityAndDistrict(
            @RequestParam String city,
            @RequestParam String district) {
        List<String> dongs = locationService.getDongsByCityAndDistrict(city, district);
        return ResponseEntity.ok(dongs);
    }
}
