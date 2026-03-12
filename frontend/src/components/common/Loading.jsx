import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const Loading = ({ fullScreen = false, size = "lg", text = "로딩 중..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner size={size} text={text} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size={size} text={text} />
    </div>
  );
};

export default Loading;
