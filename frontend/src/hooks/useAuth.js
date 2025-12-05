import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { login, logout, user, isAuthenticated } = useAuthStore()

  // 로그인
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data
      login(user, accessToken, refreshToken)
      navigate('/')
    },
  })

  // 일반 회원가입
  const signupUserMutation = useMutation({
    mutationFn: authApi.signupUser,
    onSuccess: () => {
      navigate('/login')
    },
  })

  // 기업 회원가입
  const signupStudioMutation = useMutation({
    mutationFn: authApi.signupStudio,
    onSuccess: () => {
      navigate('/login')
    },
  })

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      navigate('/')
    },
    onError: () => {
      logout()
      navigate('/')
    },
  })

  // 내 정보 조회
  const { data: me, refetch: refetchMe } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
  })

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    signupUser: signupUserMutation.mutate,
    signupStudio: signupStudioMutation.mutate,
    logout: logoutMutation.mutate,
    me: me?.data,
    refetchMe,
  }
}
