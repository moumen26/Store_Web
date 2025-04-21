import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrdersTable from "../components/OrdersTable";
import OrderCard from "../components/OrderCard";
import { formatNumber } from "../util/useFullFunctions";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Orders({ onToggle, toggleLanguage, language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestOrderData, setLatestOrderData] = useState([]);
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
            {language === "ar" ? "أحدث الطلبات" : "Dernière commandes"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
            language={language}
          />
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar">
        <OrderCard
          orderCardTitle={
            language === "ar" ? "إجمالي الطلبات" : "Total des commandes"
          }
          orderCardDetails={latestOrderData.length}
          className="flex-shrink-0 w-[280px] md:w-full"
          language={language}
        />
        <OrderCard
          orderCardTitle={
            language === "ar" ? "المبلغ الإجمالي" : "Montant total"
          }
          orderCardDetails={
            formatNumber(
              latestOrderData.reduce(
                (acc, order) => acc + Number(order?.orderAmount),
                0
              )
            ) + (language === "fr" ? " DA" : " دج")
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          language={language}
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الطلب..."
                : "Rechercher par commande..."
            }
            value={searchQuery}
            language={language}
            onChange={handleSearchChange}
          />
          <ButtonExportExel
            data={filteredData}
            language={language}
            filename={language === "ar" ? "الطلبات" : "Commandes"}
          />
        </div>
        <div className="pageTableContainer">
          <OrdersTable
            language={language}
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setLatestOrderData={setLatestOrderData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
