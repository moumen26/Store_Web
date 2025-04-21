import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import { EqualsIcon } from "@heroicons/react/16/solid";

import PurchasesTable from "../components/PurchasesTable";
import { formatNumber } from "../util/useFullFunctions";

export default function Purchases({ onToggle, toggleLanguage, language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [PurchasesData, setPurchasesData] = useState([]);
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
          <h2 className="pagesTitle">
            {language === "ar" ? " أحدث المشتريات" : "Derniers achats"}
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
        {" "}
        <OrderCard
          orderCardTitle={
            language === "ar" ? "إجمالي المشتريات" : "Total des achats"
          }
          orderCardDetails={PurchasesData.length}
          className="flex-shrink-0 w-[280px] md:w-full"
        />
        <OrderCard
          orderCardTitle={
            language === "ar" ? "المبلغ الإجمالي" : "Montant total"
          }
          orderCardDetails={
            formatNumber(
              PurchasesData.reduce(
                (acc, order) => acc + Number(order?.totalAmount),
                0
              )
            ) + (language === "fr" ? " DA" : " دج")
          }
          className="flex-shrink-0 w-[280px] md:w-full"
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الشراء..."
                : "Rechercher par achat..."
            }
            value={searchQuery}
            language={language}
            onChange={handleSearchChange}
          />
          <ButtonExportExel
            language={language}
            data={filteredData}
            filename={language === "ar" ? "المشتريات" : "Achats"}
          />
        </div>
        <div className="pageTableContainer">
          <PurchasesTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setPurchasesData={setPurchasesData}
            dateRange={dateRange}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
