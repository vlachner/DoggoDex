import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-12 h-12 border-4 rounded-full border-t-amber-500 border-r-amber-500 border-b-amber-200 border-l-amber-200 animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
