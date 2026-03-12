import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiCamera, FiDollarSign, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { locationApi } from '../../api/location.api';

const InteractiveFilter = ({ onFilterChange, filters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const shootingTypes = [
    { value: 'BODY_PROFILE', label: '바디프로필' },
    { value: 'PORTRAIT', label: '증명/프로필' },
    { value: 'FAMILY', label: '가족사진' },
    { value: 'COUPLE', label: '커플사진' },
    { value: 'WEDDING', label: '웨딩사진' },
    { value: 'GRADUATION', label: '졸업사진' },
    { value: 'PET', label: '반려동물' },
    { value: 'COMMERCIAL', label: '상업촬영' },
  ];

  const sortOptions = [
    { value: '', label: '추천순' },
    { value: 'rating,desc', label: '평점순' },
    { value: 'minPrice,asc', label: '가격 낮은순' },
    { value: 'minPrice,desc', label: '가격 높은순' },
    { value: 'reviewCount,desc', label: '후기 많은순' },
  ];

  React.useEffect(() => {
    fetchCities();
  }, []);

  React.useEffect(() => {
    if (filters.city) {
      fetchDistricts(filters.city);
      setDistricts([]);
      setDongs([]);
    }
  }, [filters.city]);

  React.useEffect(() => {
    if (filters.district) {
      fetchDongs(filters.city, filters.district);
      setDongs([]);
    }
  }, [filters.district, filters.city]);

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

  const handleFilterSubmit = (newFilters) => {
    onFilterChange({ ...filters, ...newFilters });
  };

  const handleReset = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      city: '',
      district: '',
      dong: '',
      shootingType: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full p-4 flex items-center justify-between border-b border-primary-100"
      >
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-primary-900">필터</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <FiX className={`w-5 h-5 text-primary-400 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {(isExpanded || !window.innerWidth < 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Location Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary-900 mb-4">
                  <FiMapPin className="w-5 h-5 text-accent-500" />
                  지역
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* City */}
                  <div>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterSubmit({ city: e.target.value, district: '', dong: '' })}
                      className="input"
                    >
                      <option value="">시/도 전체</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <select
                      value={filters.district}
                      onChange={(e) => handleFilterSubmit({ district: e.target.value, dong: '' })}
                      disabled={!filters.city}
                      className="input disabled:bg-primary-50"
                    >
                      <option value="">구/군 전체</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dong */}
                  <div>
                    <select
                      value={filters.dong}
                      onChange={(e) => handleFilterSubmit({ dong: e.target.value })}
                      disabled={!filters.district}
                      className="input disabled:bg-primary-50"
                    >
                      <option value="">동/읍/면 전체</option>
                      {dongs.map((dong) => (
                        <option key={dong} value={dong}>
                          {dong}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Shooting Type Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary-900 mb-4">
                  <FiCamera className="w-5 h-5 text-accent-500" />
                  촬영 종류
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {shootingTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleFilterSubmit({ shootingType: filters.shootingType === type.value ? '' : type.value })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filters.shootingType === type.value
                          ? 'bg-accent-500 text-white shadow-medium'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary-900 mb-4">
                  <FiDollarSign className="w-5 h-5 text-accent-500" />
                  가격대
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="최소 가격"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      onBlur={() => handleFilterSubmit({ minPrice: priceRange.min })}
                      className="input"
                    />
                  </div>
                  <span className="text-primary-400">~</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="최대 가격"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      onBlur={() => handleFilterSubmit({ maxPrice: priceRange.max })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary-900 mb-4">
                  <FiFilter className="w-5 h-5 text-accent-500" />
                  정렬
                </h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterSubmit({ sortBy: e.target.value })}
                  className="input"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-primary-100">
                <button
                  onClick={handleReset}
                  className="btn btn-ghost flex-1"
                >
                  초기화
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="btn btn-primary flex-1"
                >
                  적용하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveFilter;
