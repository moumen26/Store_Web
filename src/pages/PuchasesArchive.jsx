import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import PurchaseArchiveTable from "../components/PurchasesArchiveTable";

export default function PuchasesArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="pagesContainer">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
          <h2 className="pagesTitle">Puchases Archive</h2>
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
            placeholder="Search by Purchase..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Orders Archive" />
        </div>
        <div className="pageTableContainer">
          <PurchaseArchiveTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
