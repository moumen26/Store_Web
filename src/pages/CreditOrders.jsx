import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import CreditOrdersTable from "../components/CreditOrderSTable";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { formatNumber } from "../util/useFullFunctions";
import { lang } from "moment-timezone";

export default function CreditOrders({ onToggle, toggleLanguage, language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestOrderData, setCreditedOrderData] = useState([]);
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
            className="pagesTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الطلبات على الحساب" : "Commandes à crédit"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
            language={language}
          />
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar">
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "عدد الطلبات" : "Nombre total des commandes"
          }
          orderCardDetails={latestOrderData.length}
          className="flex-shrink-0 w-[280px] md:w-full"
        />
        <OrderCard
          language={language}
          orderCardTitle={language === "ar" ? "إجمالي المبلغ" : "Montant total"}
          orderCardDetails={
            formatNumber(
              latestOrderData.reduce(
                (acc, order) => acc + Number(order?.orderAmount),
                0
              )
            ) + (language === "ar" ? " دج" : " DA")
          }
          className="flex-shrink-0 w-[280px] md:w-full"
        />
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "إجمالي المدفوعات" : "Total des paiements"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            formatNumber(
              latestOrderData.reduce(
                (acc, order) =>
                  acc +
                  order.orderPayments.reduce(
                    (acc, payment) => acc + Number(payment?.amount),
                    0
                  ),
                0
              )
            ) + (language === "ar" ? " دج" : " DA")
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
                : "Rechercher par Commande..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={
              language === "ar" ? "الطلبات على الحساب" : "Commandes à crédit"
            }
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <CreditOrdersTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            setCreditedOrderData={setCreditedOrderData}
            dateRange={dateRange}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
