import axios from './axios';

export const commentApi = {
  // 스튜디오별 댓글 목록 조회
  getCommentsByStudio: async (studioId) => {
    const response = await axios.get(`/comments/studios/${studioId}`);
    return response.data;
  },

  // 댓글 작성
  createComment: async (studioId, commentData) => {
    const response = await axios.post(`/comments/studios/${studioId}`, commentData);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (commentId, commentData) => {
    const response = await axios.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    await axios.delete(`/comments/${commentId}`);
  }
};
