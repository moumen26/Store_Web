import {
  ShoppingBagIcon,
  Square2StackIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function DashboadStoreStatistic({
  StatsData,
  StatsDataLoading,
  language,
}) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
      className={`dashboadStoreStatistic ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="w-full flex items-center justify-between">
        <h3
          className="dashboardTitleItem"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "fr" ? "Statistiques du magasin" : "إحصائيات المتجر"}
        </h3>
      </div>
      <div className="flex-col h-[410px] space-y-6">
        {!StatsDataLoading ? (
          <>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3
                  className="dashboardText"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "fr"
                    ? "Nombre Total des commandes"
                    : "عدد الطلبيات"}
                </h3>
                <p className="dashboardSpan">{StatsData?.totalReceipts}</p>
              </div>
              <div className="flex items-center justify-center">
                <ShoppingBagIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3
                  className="dashboardText"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "fr"
                    ? "Nombre Total des produits"
                    : "عدد المنتجات"}
                </h3>
                <p className="dashboardSpan">{StatsData?.totalStocks}</p>
              </div>
              <div className="flex items-center justify-center">
                <Square2StackIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3
                  className="dashboardText"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "fr"
                    ? "Nombre Total des clients"
                    : "عدد العملاء"}
                </h3>
                <p className="dashboardSpan">{StatsData?.totalCustomers}</p>
              </div>
              <div className="flex items-center justify-center">
                <UserGroupIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3
                  className="dashboardText"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "fr"
                    ? "Nombre Total des vendeurs"
                    : "عدد البائعين"}
                </h3>
                <p className="dashboardSpan">{StatsData?.totalSellers}</p>
              </div>
              <div className="flex items-center justify-center">
                <UserIcon className="iconAsideBar" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
    </div>
  );
}
