import React, { useState } from 'react';

const CommentForm = ({ studioId, onSubmit, initialData = null, onCancel }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        content: content.trim(),
        rating,
      });
      
      if (!initialData) {
        setContent('');
        setRating(5);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 hover:fill-yellow-400`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialData ? '댓글 수정' : '댓글 작성'}
      </h3>

      {/* 평점 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          평점
        </label>
        {renderRatingStars()}
      </div>

      {/* 내용 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="스튜디오에 대한 솔직한 후기를 남겨주세요."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {content.length}/500
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 justify-end">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : (initialData ? '수정' : '작성')}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
