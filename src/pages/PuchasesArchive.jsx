import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import PurchaseArchiveTable from "../components/PurchasesArchiveTable";

export default function PuchasesArchive({
  onToggle,
  toggleLanguage,
  language,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
            {language === "ar" ? "أرشيف المشتريات" : "Archive des achats"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
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
              language === "ar" ? "أرشيف المشتريات" : "Archive des achats"
            }
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <PurchaseArchiveTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            dateRange={dateRange}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
