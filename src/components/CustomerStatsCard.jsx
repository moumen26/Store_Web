import { BanknotesIcon, DocumentChartBarIcon } from "@heroicons/react/16/solid";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function CustomerStatsCard({
  customerStatsCardTitle,
  customerStatsCardDetails,
  loading,
}) {
  let iconComponent, titleColor, amountColor;

  // Dynamically set the colors based on customerStatsCardTitle
  switch (customerStatsCardTitle) {
    case "Total Orders":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      titleColor = "#007bff"; // Blue for orders
      amountColor = "#007bff"; // Blue for amount
      break;
    case "Total Purchases":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      titleColor = "#007bff"; // Blue for orders
      amountColor = "#007bff"; // Blue for amount
      break;
    case "Total Paid":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#28a745"; // Green for paid
      amountColor = "#28a745"; // Green for amount
      break;
    case "Total Unpaid":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#ff9800"; // Orange for unpaid
      amountColor = "#ff9800"; // Orange for amount
      break;
    case "Total Profit":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#008080"; // Teal for profit
      amountColor = "#008080"; // Teal for amount
      break;
    default:
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#000"; // Gray for default
      amountColor = "#000"; // Gray for amount
      break;
  }

  // Handle span component for currency
  let spanComponent =
    customerStatsCardTitle === "Total Orders" ||
    customerStatsCardTitle === "Total Purchases"
      ? ""
      : " DA";

  return (
    <div className="customerStatsCard">
      {!loading ? (
        <>
          <div className="flex justify-between items-center">
            <h3
              className="dashboardCardTitle flex items-center h-[50px]"
              style={{ color: titleColor }}
            >
              {customerStatsCardTitle}
            </h3>
            {iconComponent}
          </div>
          <span
            className="dashboardCardAmount text-lg font-semibold"
            style={{ color: amountColor }}
          >
            {customerStatsCardDetails}
            {spanComponent}
          </span>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
      )}
    </div>
  );
}
