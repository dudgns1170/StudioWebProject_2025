import api from "./axios";

export const studioApi = {
  // 스튜디오 목록 조회 (지역 필터링 추가)
  getStudios: (params) =>
    api.get("/studios", { params }).then((res) => res.data),

  // 스튜디오 상세 조회
  getStudio: (studioId) =>
    api.get(`/studios/${studioId}`).then((res) => res.data),

  // 스튜디오 등록 (기업회원)
  createStudio: (data) => api.post("/studios", data).then((res) => res.data),

  // 스튜디오 수정 (기업회원)
  updateStudio: (studioId, data) =>
    api.put(`/studios/${studioId}`, data).then((res) => res.data),

  // 스튜디오 삭제 (기업회원)
  deleteStudio: (studioId) =>
    api.delete(`/studios/${studioId}`).then((res) => res.data),

  // 내 스튜디오 조회 (기업회원)
  getMyStudio: () => api.get("/studios/my").then((res) => res.data),

  // 포트폴리오 목록 조회
  getPortfolios: (studioId) =>
    api.get(`/studios/${studioId}/portfolios`).then((res) => res.data),

  // 포트폴리오 등록
  createPortfolio: (studioId, data) =>
    api.post(`/studios/${studioId}/portfolios`, data).then((res) => res.data),

  // 포트폴리오 삭제
  deletePortfolio: (portfolioId) =>
    api.delete(`/portfolios/${portfolioId}`).then((res) => res.data),

  // 지역별 스튜디오 검색
  searchStudiosByLocation: (params) => {
    const { city, district, dong, ...otherParams } = params;
    let queryParams = { ...otherParams };

    if (city) queryParams.city = city;
    if (district) queryParams.district = district;
    if (dong) queryParams.dong = dong;

    return api
      .get("/studios/search", { params: queryParams })
      .then((res) => res.data);
  },
};
