import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonExportExel from "../components/ButtonExportExel";
import OrdersArchiveTable from "../components/OrdersArchiveTable";
import DashboardCalendar from "../components/DashboardCalendar";

export default function OrdersArchive({ onToggle, toggleLanguage, language }) {
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
      className="pagesContainer pageContainerCards"
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
            {language === "ar" ? "أرشيف الطلبات" : "Archive des commandes"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
            language={language}
          />
        </div>
      </div>
      <div className="pageTable">
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الطلب..."
                : "Rechercher par commande..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={
              language === "ar" ? "أرشيف الطلبات" : "Archive des Commandes"
            }
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <OrdersArchiveTable
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
