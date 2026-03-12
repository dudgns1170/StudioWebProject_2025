import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudio, usePortfolios } from "../hooks/useStudio";
import { useStudioReviews } from "../hooks/useReview";
import { useAuthStore } from "../store/authStore";
import StudioInfo from "../components/studio/StudioInfo";
import PortfolioGallery from "../components/studio/PortfolioGallery";
import ImageGallery from "../components/studio/ImageGallery";
import ReviewCard from "../components/review/ReviewCard";
import CommentList from "../components/comment/CommentList";
import CommentForm from "../components/comment/CommentForm";
import StickyBookingWidget from "../components/studio/StickyBookingWidget";
import { commentApi } from "../api/comment.api";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiCamera,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";

function StudioDetailPage() {
  const { studioId } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("info");
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: studioData, isLoading: studioLoading } = useStudio(studioId);
  const { data: portfolioData } = usePortfolios(studioId);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useStudioReviews(studioId);

  const studio = studioData?.data;
  const portfolios = portfolioData?.data || [];
  const reviews = reviewsData?.data || [];

  // Create gallery images from portfolio and thumbnail
  const galleryImages = [
    studio?.thumbnailUrl,
    ...(portfolios?.map((p) => p.imageUrl) || []),
  ].filter(Boolean);

  // 댓글 조회
  const fetchComments = async () => {
    try {
      const data = await commentApi.getCommentsByStudio(studioId);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // 댓글 작성/수정
  const handleCommentSubmit = async (commentData) => {
    try {
      if (editingComment) {
        const updated = await commentApi.updateComment(
          editingComment.id,
          commentData,
        );
        setComments(
          comments.map((c) => (c.id === editingComment.id ? updated : c)),
        );
        setEditingComment(null);
      } else {
        const created = await commentApi.createComment(studioId, commentData);
        setComments([created, ...comments]);
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      throw error;
    }
  };

  // 댓글 수정
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setShowCommentForm(true);
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await commentApi.deleteComment(commentId);
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  // 댓글 폼 취소
  const handleCancelComment = () => {
    setEditingComment(null);
    setShowCommentForm(false);
  };

  // 탭 변경 시 댓글 조회
  useEffect(() => {
    if (activeTab === "comments" && comments.length === 0) {
      fetchComments();
    }
  }, [activeTab, studioId]);

  if (studioLoading) {
    return <Loading fullScreen />;
  }

  if (!studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">스튜디오를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const tabs = [
    { id: "info", label: "정보", icon: FiMapPin },
    {
      id: "portfolio",
      label: `포트폴리오 (${portfolios.length})`,
      icon: FiCamera,
    },
    { id: "reviews", label: `후기 (${reviews.length})`, icon: FiStar },
    {
      id: "comments",
      label: `댓글 (${comments.length})`,
      icon: FiMessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-cool">
      {/* Image Gallery */}
      <div className="container-custom pt-8">
        <ImageGallery images={galleryImages} />
      </div>

      {/* Studio Info Header */}
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="heading-hero text-primary-900 mb-4">
                {studio.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-primary-600">
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  <span>{studio.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiPhone className="w-4 h-4" />
                  <span>{studio.phone || "02-1234-5678"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>09:00 - 21:00</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">
                  {studio.rating?.toFixed(1) || "0.0"}
                </div>
                <div className="text-sm text-primary-600">평점</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">
                  {studio.reviewCount || 0}
                </div>
                <div className="text-sm text-primary-600">후기</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-soft p-2 mb-6">
              <nav className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all flex-1 justify-center ${
                      activeTab === tab.id
                        ? "bg-accent-500 text-white shadow-medium"
                        : "text-primary-600 hover:bg-primary-100"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "info" && <StudioInfo studio={studio} />}
              {activeTab === "portfolio" && (
                <PortfolioGallery portfolios={portfolios} />
              )}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loading />
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-center text-primary-600 py-12">
                      아직 후기가 없습니다.
                    </p>
                  )}
                </div>
              )}
              {activeTab === "comments" && (
                <div className="space-y-6">
                  {/* 댓글 작성 폼 */}
                  {isAuthenticated && (
                    <div>
                      {!showCommentForm ? (
                        <button
                          onClick={() => setShowCommentForm(true)}
                          className="btn btn-primary w-full"
                        >
                          댓글 작성하기
                        </button>
                      ) : (
                        <CommentForm
                          studioId={studioId}
                          onSubmit={handleCommentSubmit}
                          initialData={editingComment}
                          onCancel={handleCancelComment}
                        />
                      )}
                    </div>
                  )}

                  {/* 댓글 목록 */}
                  <CommentList
                    comments={comments}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    currentUserId={user?.id}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar - Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <StickyBookingWidget studio={studio} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioDetailPage;
