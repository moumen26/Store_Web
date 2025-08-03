import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

// Modern Pagination Component
export default function ModernPagination({
  currentPage,
  totalPages,
  onPageChange,
  language,
}) {
  const isRTL = language === "ar";

  return (
    <div className="flex items-center justify-center md:gap-4 gap-3 md:p-3 p-2">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center md:w-10 md:h-10 w-7 h-7 md:rounded-lg rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        title={language === "ar" ? "السابق" : "Précédent"}
      >
        {isRTL ? (
          <ChevronRightIcon className="md:w-5 md:h-5 w-3.5 h-3.5 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="md:w-5 md:h-5 w-3.5 h-3.5 text-gray-600" />
        )}
      </button>

      {/* Current Page Display */}
      <div className="flex items-center md:gap-2 gap-1.5 font-medium md:text-base text-sm text-gray-700">
        <span className="text-blue-600 font-semibold">
          {String(currentPage).padStart(2, "0")}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">
          {String(totalPages).padStart(2, "0")}
        </span>
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center md:w-10 md:h-10 w-7 h-7 md:rounded-lg rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        title={language === "ar" ? "التالي" : "Suivant"}
      >
        {isRTL ? (
          <ChevronLeftIcon className="md:w-5 md:h-5 w-3.5 h-3.5 text-gray-600" />
        ) : (
          <ChevronRightIcon className="md:w-5 md:h-5 w-3.5 h-3.5 text-gray-600" />
        )}
      </button>
    </div>
  );
}
