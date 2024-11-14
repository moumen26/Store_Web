import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import OrdersArchiveTable from "../components/OrdersArchiveTable";
import DashboardCalendar from "../components/DashboardCalendar";
export default function OrdersArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      // Update dashboard content based on the selected date range
      updateDashboardContent(dateRange.startDate, dateRange.endDate);
    }
  }, [dateRange]);

  const updateDashboardContent = (startDate, endDate) => {
    // Logic to update dashboard content based on selected date range
    console.log("Selected range:", startDate, endDate);
    // Fetch or filter data based on date range and update dashboard content
  };
  return (
    <div className="pagesContainer">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
          <h2 className="pagesTitle">Orders Archive</h2>
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
            placeholder="Search by Order..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Orders Archive" />
        </div>
        <div className="pageTableContainer">
          <OrdersArchiveTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
