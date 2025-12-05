import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StudioListPage from './pages/StudioListPage'
import StudioDetailPage from './pages/StudioDetailPage'
import ReservationPage from './pages/ReservationPage'
import Login from './pages/auth/Login'
import SignupSelect from './pages/auth/SignupSelect'
import UserSignup from './pages/auth/UserSignup'
import StudioSignup from './pages/auth/StudioSignup'
import MyPage from './pages/user/MyPage'
import MyReservations from './pages/user/MyReservations'
import MyReviews from './pages/user/MyReviews'
import StudioDashboard from './pages/studio/StudioDashboard'
import StudioManage from './pages/studio/StudioManage'
import PortfolioManage from './pages/studio/PortfolioManage'
import ReservationManage from './pages/studio/ReservationManage'
import ReviewManage from './pages/studio/ReviewManage'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/studios" element={<StudioListPage />} />
      <Route path="/studios/:studioId" element={<StudioDetailPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupSelect />} />
      <Route path="/signup/user" element={<UserSignup />} />
      <Route path="/signup/studio" element={<StudioSignup />} />
      
      {/* User Routes */}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/reservations" element={<MyReservations />} />
      <Route path="/mypage/reviews" element={<MyReviews />} />
      <Route path="/reservation/:studioId" element={<ReservationPage />} />
      
      {/* Studio Owner Routes */}
      <Route path="/studio/dashboard" element={<StudioDashboard />} />
      <Route path="/studio/manage" element={<StudioManage />} />
      <Route path="/studio/portfolio" element={<PortfolioManage />} />
      <Route path="/studio/reservations" element={<ReservationManage />} />
      <Route path="/studio/reviews" element={<ReviewManage />} />
    </Routes>
  )
}

export default AppRoutes
