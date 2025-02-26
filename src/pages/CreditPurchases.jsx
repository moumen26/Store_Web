import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import CreditPurchasesTable from "../components/CreditPurchasesTable";

export default function CreditPurchases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [PurchasesData, setPurchasesData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer pageContainerCards">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
          <h2 className="pagesTitle">Credit Purchases</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <OrderCard
          orderCardTitle="Total purchases"
          orderCardDetails={PurchasesData.length}
        />
        <OrderCard
          orderCardTitle="Total amount"
          orderCardDetails={
            PurchasesData.reduce((acc, order) => acc + Number(order?.totalAmount), 0
          ) + " DA"}
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Search by Purchase..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Purchases" />
        </div>
        <div className="pageTableContainer">
          <CreditPurchasesTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setPurchasesData={setPurchasesData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
