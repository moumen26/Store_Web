import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrdersInPreparationTable from "../components/OrdersInPreparationTable";
import OrderCard from "../components/OrderCard";

export default function OrdersInPreparation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestOrderData, setNonDelivredOrderData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };



  return (
    <div className="pagesContainer pageContainerCards">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
          <h2 className="pagesTitle">Orders</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <OrderCard
          orderCardTitle="Total Orders"
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard orderCardTitle="In preparation orders" orderCardDetails={
          latestOrderData.filter(order => order?.orderStatus == 1).length
        } />
        <OrderCard orderCardTitle="Ready & On the way orders" orderCardDetails={
          latestOrderData.filter(order => order?.orderStatus == 2).length
        } />
        <OrderCard orderCardTitle="Picked up & Delivred orders" orderCardDetails={
          latestOrderData.filter(order => order?.orderStatus == 3).length
        } />
        <OrderCard
          orderCardTitle="Total Amount"
          orderCardDetails={
            latestOrderData.reduce((acc, order) => acc + Number(order?.orderAmount), 0
          ) + " DA"}
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
          <OrdersInPreparationTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setNonDelivredOrderData={setNonDelivredOrderData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
