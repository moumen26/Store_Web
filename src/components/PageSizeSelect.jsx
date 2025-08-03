import { ChevronDownIcon } from "@heroicons/react/16/solid";

import { useState, useRef, useEffect } from "react";

// Page Size Select Component
export default function PageSizeSelect({
  pageSize,
  onPageSizeChange,
  language,
  options = [10, 25, 50, 100],
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isRTL = language === "ar";
  const elementText = language === "ar" ? "عنصر" : "éléments";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    onPageSizeChange(option);
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center md:gap-3 gap-2">
      {/* Label */}
      <span
        className="md:text-sm text-xs text-gray-600 font-medium whitespace-nowrap"
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
      >
        {language === "ar" ? "عرض" : "Afficher"}
      </span>

      {/* Custom Select Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Select Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`
            flex items-center justify-between bg-white border border-gray-300 rounded-md
            md:px-3 md:py-2 px-2 py-1.5
            md:text-sm text-xs text-gray-700 font-medium
            md:min-w-[100px] min-w-[85px]
            hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
            transition-all duration-200
            ${showDropdown ? "border-blue-500 ring-1 ring-blue-500" : ""}
          `}
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >{`${pageSize} ${elementText}`}</span>
          <ChevronDownIcon
            className={`md:w-4 md:h-4 w-3 h-3 text-gray-500 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-10 md:top-12 ${
            isRTL ? "right-0" : "left-0"
          } w-32 md:w-36 bg-white shadow-lg rounded-lg border border-gray-200 z-30 transform ${
            showDropdown
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          } transition-transform duration-200 ease-out`}
        >
          <div className="py-2">
            {options.map((option) => (
              <div
                key={option}
                className={`flex items-center justify-between px-3 md:px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                  pageSize === option
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <span
                  className={`md:text-sm text-xs font-medium ${
                    pageSize === option ? "text-blue-700" : "text-gray-700"
                  }`}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {`${option} ${elementText}`}
                </span>
                {pageSize === option && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
