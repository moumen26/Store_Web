import { CircularProgress } from "@mui/material";
import React from "react";
import { Card } from "antd";
import {
  BanknotesIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/16/solid";

export default function DashboardCard({
  dashboardCardTitle,
  dashboardCardAmount,
  OrdersStatsLoading = false,
  language,
  className = "",
}) {
  let iconComponent;

  switch (dashboardCardTitle) {
    case "Profit":
    case "الربح":
      iconComponent = <BanknotesIcon className="iconPages" />;
      break;
    case "Total des commandes":
    case "عدد الطلبيات":
      iconComponent = <CircleStackIcon className="iconPages" />;
      break;
    case "Montant total des commandes":
    case " المبلغ الإجمالي للطلبيات":
      iconComponent = <BanknotesIcon className="iconPages" />;
      break;
    default:
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      break;
  }

  return (
    <>
      {!OrdersStatsLoading ? (
        <Card
          style={{
            borderRadius: 20,
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          }}
          className={`responsive-card ${className}`}
        >
          <div className="w-full h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h3
                className="dashboardCardTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {dashboardCardTitle}
              </h3>
              {iconComponent}
            </div>
            <div className="flex justify-between items-center">
              <h2
                className="dashboardCardAmount"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {dashboardCardAmount}
                {dashboardCardTitle !== "Total des commandes" &&
                dashboardCardTitle !== "إجمالي الطلبات"
                  ? language === "fr"
                    ? "DA"
                    : " دج"
                  : ""}
              </h2>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          style={{
            height: "200px",
            borderRadius: 20,
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          }}
          className={`${className}`}
        >
          <div className="w-full h-[160px] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        </Card>
      )}
    </>
  );
}
