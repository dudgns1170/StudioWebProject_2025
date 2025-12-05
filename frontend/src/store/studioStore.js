import { create } from 'zustand'

export const useStudioStore = create((set) => ({
  studios: [],
  selectedStudio: null,
  loading: false,
  error: null,

  setStudios: (studios) => set({ studios }),
  
  setSelectedStudio: (studio) => set({ selectedStudio: studio }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  clearSelectedStudio: () => set({ selectedStudio: null }),
}))
