import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studioApi } from '../api/studio.api'
import { useFilterStore } from '../store/filterStore'

export const useStudios = (customParams = null) => {
  const getQueryParams = useFilterStore((state) => state.getQueryParams)
  const params = customParams || getQueryParams()

  return useQuery({
    queryKey: ['studios', params],
    queryFn: () => studioApi.getStudios(params),
  })
}

export const useStudio = (studioId) => {
  return useQuery({
    queryKey: ['studio', studioId],
    queryFn: () => studioApi.getStudio(studioId),
    enabled: !!studioId,
  })
}

export const useMyStudio = () => {
  return useQuery({
    queryKey: ['myStudio'],
    queryFn: studioApi.getMyStudio,
  })
}

export const useCreateStudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studioApi.createStudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStudio'] })
    },
  })
}

export const useUpdateStudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studioId, data }) => studioApi.updateStudio(studioId, data),
    onSuccess: (_, { studioId }) => {
      queryClient.invalidateQueries({ queryKey: ['studio', studioId] })
      queryClient.invalidateQueries({ queryKey: ['myStudio'] })
    },
  })
}

export const usePortfolios = (studioId) => {
  return useQuery({
    queryKey: ['portfolios', studioId],
    queryFn: () => studioApi.getPortfolios(studioId),
    enabled: !!studioId,
  })
}

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studioId, data }) => studioApi.createPortfolio(studioId, data),
    onSuccess: (_, { studioId }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios', studioId] })
    },
  })
}

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studioApi.deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })
}
