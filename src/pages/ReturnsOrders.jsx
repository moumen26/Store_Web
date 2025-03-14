import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonExportExel from "../components/ButtonExportExel";
import OrdersReturnsTable from "../components/OrdersReturnsTable";
import DashboardCalendar from "../components/DashboardCalendar";

export default function ReturnsOrders({ onToggle, isCollapsed }) {
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
          <h2 className="pagesTitle">Commandes de retour</h2>
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
            placeholder="Rechercher par commande..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel
            data={filteredData}
            filename="Commandes de Retour"
          />
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
