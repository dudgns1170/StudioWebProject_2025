import React, { useEffect, useState } from 'react';
import { locationApi } from '../../api/location.api';

const LocationFilter = ({ onLocationChange }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity);
      setDistricts([]);
      setDongs([]);
      setSelectedDistrict('');
      setSelectedDong('');
    } else {
      setDistricts([]);
      setDongs([]);
      setSelectedDistrict('');
      setSelectedDong('');
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchDongs(selectedCity, selectedDistrict);
      setDongs([]);
      setSelectedDong('');
    } else {
      setDongs([]);
      setSelectedDong('');
    }
  }, [selectedDistrict, selectedCity]);

  const fetchCities = async () => {
    try {
      const data = await locationApi.getCities();
      setCities(data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchDistricts = async (city) => {
    try {
      const data = await locationApi.getDistricts(city);
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const fetchDongs = async (city, district) => {
    try {
      const data = await locationApi.getDongs(city, district);
      setDongs(data);
    } catch (error) {
      console.error('Failed to fetch dongs:', error);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    onLocationChange({ city, district: '', dong: '' });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    onLocationChange({ city: selectedCity, district, dong: '' });
  };

  const handleDongChange = (e) => {
    const dong = e.target.value;
    setSelectedDong(dong);
    onLocationChange({ city: selectedCity, district: selectedDistrict, dong });
  };

  const handleReset = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedDong('');
    setDistricts([]);
    setDongs([]);
    onLocationChange({ city: '', district: '', dong: '' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">지역으로 찾기</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          초기화
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 시/도 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시/도
          </label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 구/군 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            구/군
          </label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedCity}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">전체</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* 동/읍/면 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            동/읍/면
          </label>
          <select
            value={selectedDong}
            onChange={handleDongChange}
            disabled={!selectedDistrict}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">전체</option>
            {dongs.map((dong) => (
              <option key={dong} value={dong}>
                {dong}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationFilter;
