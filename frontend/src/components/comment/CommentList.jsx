import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const CommentList = ({ comments, onEdit, onDelete, currentUserId }) => {
  const renderRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 작성된 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                {comment.user?.name?.[0] || comment.createdBy?.[0] || 'U'}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  {comment.user?.name || comment.createdBy}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </div>
              </div>
            </div>
            
            {/* 수정/삭제 버튼 */}
            {comment.user?.id === currentUserId && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(comment)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 평점 */}
          <div className="flex items-center mb-2">
            {renderRating(comment.rating)}
            <span className="ml-2 text-sm text-gray-600">{comment.rating}.0</span>
          </div>

          {/* 내용 */}
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
