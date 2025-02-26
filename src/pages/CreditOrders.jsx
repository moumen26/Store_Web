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
  const [latestOrderData, setCreditedOrderData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
        <OrderCard
          orderCardTitle="Total orders"
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard
          orderCardTitle="Total amount"
          orderCardDetails={
            latestOrderData.reduce((acc, order) => acc + Number(order?.orderAmount), 0) + " DA"}
        />
        <OrderCard
          orderCardTitle="Total payments"
          orderCardDetails={
            latestOrderData.reduce((acc, order) => acc + order.orderPayments.reduce((acc, payment) => acc + Number(payment?.amount), 0), 0) + " DA"}
        />
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
            setCreditedOrderData={setCreditedOrderData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
