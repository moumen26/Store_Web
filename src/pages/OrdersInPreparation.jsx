import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrdersInPreparationTable from "../components/OrdersInPreparationTable";
import OrderCard from "../components/OrderCard";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { formatNumber } from "../util/useFullFunctions";

export default function OrdersInPreparation({ onToggle, isCollapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestOrderData, setNonDelivredOrderData] = useState([]);
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
          <h2 className="pagesTitle">Commandes en cours</h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <OrderCard
          orderCardTitle="Total des Commandes"
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard
          orderCardTitle="Commandes en préparation"
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 1).length
          }
        />
        <OrderCard
          orderCardTitle="Commandes prêtes et en cours de livraison"
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 2).length
          }
        />
        <OrderCard
          orderCardTitle="Commandes récupérées et livrées"
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 3).length
          }
        />
        <OrderCard
          orderCardTitle="Montant Total"
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
          <ButtonExportExel data={filteredData} filename="Commande" />
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
