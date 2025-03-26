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
}) {
  let iconComponent;

  switch (dashboardCardTitle) {
    case "Profit":
    case "الربح":
      iconComponent = <BanknotesIcon className="iconPages" />;
      break;
    case "Total des commandes":
    case "إجمالي الطلبات":
      iconComponent = <CircleStackIcon className="iconPages" />;
      break;
    case "Montant total":
    case "المبلغ الإجمالي":
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
            width: "100%",
            height: "180px",
            borderRadius: 20,
          }}
          className="responsive-card"
        >
          <div className="w-full h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h3 className="dashboardCardTitle">{dashboardCardTitle}</h3>
              {iconComponent}
            </div>
            <div className="flex justify-between items-center">
              <h2 className="dashboardCardAmount">
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
            width: "100%",
            height: "200px",
            borderRadius: 20,
          }}
        >
          <div className="w-full h-[160px] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        </Card>
      )}
    </>
  );
}
