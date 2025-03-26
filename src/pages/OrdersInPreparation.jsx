import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrdersInPreparationTable from "../components/OrdersInPreparationTable";
import OrderCard from "../components/OrderCard";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { formatNumber } from "../util/useFullFunctions";

export default function OrdersInPreparation({
  onToggle,
  toggleLanguage,
  language,
}) {
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
    <div
      className="pagesContainer pageContainerCards"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>
        <div className="titlePageButton">
          <h2 className="pagesTitle">
            {language === "ar" ? "الطلبات قيد التحضير" : "Commandes en cours"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
            language={language}
          />
        </div>
      </div>
      <div className="cardMediaScreen gridCols">
        <OrderCard
          orderCardTitle={
            language === "ar" ? "إجمالي الطلبات" : "Total des Commandes"
          }
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard
          orderCardTitle={
            language === "ar"
              ? "الطلبات قيد التحضير"
              : "Commandes en préparation"
          }
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 1).length
          }
        />
        <OrderCard
          orderCardTitle={
            language === "ar"
              ? "الطلبات الجاهزة وقيد التسليم"
              : "Commandes prêtes et en cours de livraison"
          }
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 2).length
          }
        />
        <OrderCard
          orderCardTitle={
            language === "ar"
              ? "الطلبات المستلمة والمسلّمة"
              : "Commandes récupérées et livrées"
          }
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 3).length
          }
        />
        <OrderCard
          orderCardTitle={language === "ar" ? "إجمالي المبلغ" : "Montant Total"}
          orderCardDetails={
            formatNumber(
              latestOrderData.reduce(
                (acc, order) => acc + Number(order?.orderAmount),
                0
              )
            ) + (language === "fr" ? " DA" : " دج")
          }
        />
      </div>
      <div className="pageTable ordersTable">
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الطلب..."
                : "Rechercher par commande..."
            }
            language={language}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ButtonExportExel
            language={language}
            data={filteredData}
            filename={
              language === "ar" ? "الطلبات قيد التحضير" : "Commandes en cours"
            }
          />
        </div>
        <div className="pageTableContainer">
          <OrdersInPreparationTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setNonDelivredOrderData={setNonDelivredOrderData}
            dateRange={dateRange}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
