import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

// Modern Pagination Component
export default function ModernPagination ({ 
    currentPage, totalPages, onPageChange, language 
}) {
  const isRTL = language === "ar";
  
  return (
    <div className="simple-pagination-container">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-nav-btn"
        title={language === "ar" ? "السابق" : "Précédent"}
      >
        {isRTL ? (
          <ChevronRightIcon className="pagination-icon" />
        ) : (
          <ChevronLeftIcon className="pagination-icon" />
        )}
      </button>

      {/* Current Page Display */}
      <div className="page-display">
        <span className="page-number">
          {String(currentPage).padStart(2, '0')}
        </span>
        <span className="page-separator">/</span>
        <span className="total-pages">
          {String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-nav-btn"
        title={language === "ar" ? "التالي" : "Suivant"}
      >
        {isRTL ? (
          <ChevronLeftIcon className="pagination-icon" />
        ) : (
          <ChevronRightIcon className="pagination-icon" />
        )}
      </button>
    </div>
  );
};