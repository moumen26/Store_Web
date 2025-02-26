import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import OrdersReturnsTable from "../components/OrdersReturnsTable";
import DashboardCalendar from "../components/DashboardCalendar";
export default function ReturnsOrders() {
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
          <h2 className="pagesTitle">Returns Orders</h2>
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
          <ButtonExportExel data={filteredData} filename="Returns Orders" />
        </div>
        <div className="pageTableContainer">
          <OrdersReturnsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
