import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonExportExel from "../components/ButtonExportExel";
import PurchasesReturnsTable from "../components/PurchasesReturnsTable";
import DashboardCalendar from "../components/DashboardCalendar";
import ModernPagination from "../components/ModernPagination";

export default function ReturnsPurchases({
  onToggle,
  toggleLanguage,
  language,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [PurchasesData, setPurchasesData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 15,
    has_next_page: false,
    has_prev_page: false,
  });

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, dateRange.startDate, dateRange.endDate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (start, end) => {
    setDateRange({ startDate: start, endDate: end });
  };

  // Handle pagination info from OrdersTable
  const handlePaginationChange = useCallback((paginationData) => {
    setPaginationInfo(paginationData);
    setTotalPages(paginationData.total_pages || 0);
    setTotalItems(paginationData.total_items || 0);
    setTotalPrice(paginationData.total_price || 0);
  }, []);

  // Calculate summary data for cards
  const summaryData = {
    totalPurchases: totalItems, // Use server-side total
    totalAmount: totalPrice, // This shows amount for current page only
  };

  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>
        <div className="titlePageButton">
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="pagesTitle"
          >
            {language === "ar" ? "المشتريات إرجاع  " : "Achats de retour"}
          </h2>
          <DashboardCalendar
            onDateChange={handleDateChange}
            language={language}
          />
        </div>
      </div>

      <div
        className="pageTable"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الشراء..."
                : "Rechercher par achat..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={
              language === "ar" ? "مرتجعات المشتريات" : "Achats de retour"
            }
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <PurchasesReturnsTable
            searchQuery={debouncedSearchQuery}
            setPurchasesData={setPurchasesData}
            setFilteredData={setFilteredData}
            dateRange={dateRange}
            language={language}
            currentPage={currentPage}
            onPaginationChange={handlePaginationChange}
          />
        </div>
        {/* Modern Pagination - only show if there are multiple pages */}
        {totalPages > 1 && (
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            language={language}
          />
        )}

        {/* Pagination Info */}
        {totalItems > 0 && (
          <div className="pagination-info" style={{ 
            padding: "12px 20px", 
            fontSize: "14px", 
            color: "#6B7280",
            textAlign: language === "ar" ? "right" : "left",
            borderTop: "1px solid #E5E7EB"
          }}>
            {language === "ar" 
              ? `إظهار ${Math.min(paginationInfo.items_per_page, PurchasesData.length)} من أصل ${totalItems} طلب`
              : `Affichage de ${Math.min(paginationInfo.items_per_page, PurchasesData.length)} sur ${totalItems} commandes`
            }
          </div>
        )}

        {/* Active Filters Display */}
        {(debouncedSearchQuery || dateRange.startDate || dateRange.endDate) && (
          <div className="active-filters" style={{
            padding: "8px 20px",
            backgroundColor: "#F3F4F6",
            borderTop: "1px solid #E5E7EB",
            fontSize: "12px",
            color: "#6B7280"
          }}>
            <span style={{ fontWeight: "500" }}>
              {language === "ar" ? "المرشحات النشطة:" : "Filtres actifs:"}
            </span>
            {debouncedSearchQuery && (
              <span style={{ marginLeft: "8px", marginRight: "8px" }}>
                {language === "ar" ? `البحث: "${debouncedSearchQuery}"` : `Recherche: "${debouncedSearchQuery}"`}
              </span>
            )}
            {dateRange.startDate && dateRange.endDate && (
              <span style={{ marginLeft: "8px", marginRight: "8px" }}>
                {language === "ar" 
                  ? `التاريخ: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`
                  : `Date: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`
                }
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
