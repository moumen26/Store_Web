import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrdersTable from "../components/OrdersTable";
import OrderCard from "../components/OrderCard";
import { formatNumber } from "../util/useFullFunctions";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Orders({ onToggle, isCollapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestOrderData, setLatestOrderData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer pageContainerCards">
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
          <h2 className="pagesTitle">Dernière commandes</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>
      <div className="CardClass flex items-center space-x-6">
        <OrderCard
          orderCardTitle="Total des commandes"
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard
          orderCardTitle="Montant total"
          orderCardDetails={
            formatNumber(
              latestOrderData.reduce(
                (acc, order) => acc + Number(order?.orderAmount),
                0
              )
            ) + " DA"
          }
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Rechercher par Commande..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Commandes" />
        </div>
        <div className="pageTableContainer">
          <OrdersTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setLatestOrderData={setLatestOrderData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
