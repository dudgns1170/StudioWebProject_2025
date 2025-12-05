import { create } from 'zustand'

export const useFilterStore = create((set, get) => ({
  filters: {
    city: '',
    shootingType: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'latest',
  },
  page: 0,
  size: 12,

  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    page: 0, // 필터 변경 시 페이지 초기화
  })),

  setFilters: (filters) => set({ filters, page: 0 }),

  resetFilters: () => set({
    filters: {
      city: '',
      shootingType: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'latest',
    },
    page: 0,
  }),

  setPage: (page) => set({ page }),
  
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  
  prevPage: () => set((state) => ({ page: Math.max(0, state.page - 1) })),

  getQueryParams: () => {
    const { filters, page, size } = get()
    return {
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      ),
      page,
      size,
    }
  },
}))
