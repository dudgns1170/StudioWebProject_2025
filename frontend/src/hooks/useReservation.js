import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationApi } from '../api/reservation.api'

export const useMyReservations = () => {
  return useQuery({
    queryKey: ['myReservations'],
    queryFn: reservationApi.getMyReservations,
  })
}

export const useStudioReservations = () => {
  return useQuery({
    queryKey: ['studioReservations'],
    queryFn: reservationApi.getStudioReservations,
  })
}

export const useReservation = (reservationId) => {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => reservationApi.getReservation(reservationId),
    enabled: !!reservationId,
  })
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationApi.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] })
    },
  })
}

export const useApproveReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationApi.approveReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioReservations'] })
    },
  })
}

export const useRejectReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationApi.rejectReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioReservations'] })
    },
  })
}

export const useCompleteReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationApi.completeReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioReservations'] })
    },
  })
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationApi.cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] })
      queryClient.invalidateQueries({ queryKey: ['studioReservations'] })
    },
  })
}
