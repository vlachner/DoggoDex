import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBreedsAsync, setCurrentPage } from "../redux/slices/breedsSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import React from "react";

const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages } = useAppSelector((state) => state.breeds);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    dispatch(setCurrentPage(newPage));
    dispatch(fetchBreedsAsync(newPage));
  };

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible);

    if (end - start < maxVisible && start > 0) {
      start = Math.max(0, end - maxVisible);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center mt-6 space-x-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`p-2 rounded-md ${
          currentPage === 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        data-testid="page-button-prev"
      >
        <ChevronLeft size={20} />
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            currentPage === page
              ? "bg-amber-500 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`p-2 rounded-md ${
          currentPage === totalPages - 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        data-testid="page-button-next"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
