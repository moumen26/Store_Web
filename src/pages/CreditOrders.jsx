import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import CreditOrdersTable from "../components/CreditOrderSTable";

export default function CreditOrders() {
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
    <div className="pagesContainer pageContainerCards">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
          <h2 className="pagesTitle">Credit Orders</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <OrderCard orderCardTitle="Total Credit Orders" orderCardDetails={0} />
        <OrderCard orderCardTitle="Total Amount Credit" orderCardDetails={0} />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Search by Order..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Orders" />
        </div>
        <div className="pageTableContainer">
          <CreditOrdersTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
