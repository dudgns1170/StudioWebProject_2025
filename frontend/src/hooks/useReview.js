import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '../api/review.api'

export const useStudioReviews = (studioId) => {
  return useQuery({
    queryKey: ['reviews', 'studio', studioId],
    queryFn: () => reviewApi.getStudioReviews(studioId),
    enabled: !!studioId,
  })
}

export const useMyReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'my'],
    queryFn: reviewApi.getMyReviews,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'studio', variables.studioId] })
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['myReservations'] })
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, data }) => reviewApi.updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
