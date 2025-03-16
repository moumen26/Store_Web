import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonExportExel from "../components/ButtonExportExel";
import PurchasesReturnsTable from "../components/PurchasesReturnsTable";
import DashboardCalendar from "../components/DashboardCalendar";

export default function ReturnsPurchases({ onToggle, isCollapsed }) {
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
    <div className="pagesContainer">
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div
            onClick={onToggle}
            className="w-fit h-fit p-1 flex justify-center items-center border border-[#c9e4ee] rounded-[4px] cursor-pointer"
          >
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header />
        </div>{" "}
        <div className="titlePageButton">
          <h2 className="pagesTitle">Achats de retour</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>

      <div className="pageTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Rechercher par achat..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Achats de retour" />
        </div>
        <div className="pageTableContainer">
          <PurchasesReturnsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
