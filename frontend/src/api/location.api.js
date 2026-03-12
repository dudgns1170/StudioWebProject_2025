import axios from './axios';

export const locationApi = {
  // 모든 시/도 목록 조회
  getCities: async () => {
    const response = await axios.get('/locations/cities');
    return response.data;
  },

  // 특정 시/도에 속한 구/군 목록 조회
  getDistricts: async (city) => {
    const response = await axios.get('/locations/districts', {
      params: { city }
    });
    return response.data;
  },

  // 특정 시/도, 구/군에 속한 동/읍/면 목록 조회
  getDongs: async (city, district) => {
    const response = await axios.get('/locations/dongs', {
      params: { city, district }
    });
    return response.data;
  }
};
