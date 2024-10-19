import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import OrdersArchiveTable from "../components/OrdersArchiveTable";
import DashboardCalendar from "../components/DashboardCalendar";
export default function ReturnsPurchases() {
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
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Returns Purchases</h2>
        <DashboardCalendar
          onDateChange={(start, end) =>
            setDateRange({ startDate: start, endDate: end })
          }
        />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Purchase..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Returns Purchases" />
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
