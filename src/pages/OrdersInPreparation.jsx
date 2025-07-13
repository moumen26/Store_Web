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
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="pagesTitle"
          >
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
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-5 md:gap-4 md:overflow-x-visible hide-scrollbar">
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "عدد الطلبيات" : "Nombre total des Commandes"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={latestOrderData.length}
        />
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar"
              ? "الطلبات قيد التحضير"
              : "Nombre commandes en préparation"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 1).length
          }
        />
        <OrderCard
          language={language}
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardTitle={
            language === "ar"
              ? "الطلبات الجاهزة وقيد التسليم"
              : "Nombre commandes prêtes et en cours de livraison"
          }
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 2).length
          }
        />
        <OrderCard
          language={language}
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardTitle={
            language === "ar"
              ? "الطلبات المستلمة والمسلّمة"
              : "Nombre commandes récupérées et livrées"
          }
          orderCardDetails={
            latestOrderData.filter((order) => order?.orderStatus == 3).length
          }
        />
        <OrderCard
          language={language}
          className="flex-shrink-0 w-[280px] md:w-full"
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
      <div
        className="pageTable ordersTable"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
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
