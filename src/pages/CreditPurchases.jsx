import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import CreditPurchasesTable from "../components/CreditPurchasesTable";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function CreditPurchases({ onToggle, isCollapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [PurchasesData, setPurchasesData] = useState([]);
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
        <h2 className="pagesTitle">Achats à crédit</h2>
        <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <OrderCard
          orderCardTitle="Total des achats"
          orderCardDetails={PurchasesData.length}
        />
        <OrderCard
          orderCardTitle="Montant total"
          orderCardDetails={
            PurchasesData.reduce(
              (acc, order) => acc + Number(order?.totalAmount),
              0
            ) + " DA"
          }
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Rechercher par achat..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Achats à crédit" />
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
