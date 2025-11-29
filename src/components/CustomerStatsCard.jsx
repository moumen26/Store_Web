import { BanknotesIcon, DocumentChartBarIcon } from "@heroicons/react/16/solid";
import { CircularProgress } from "@mui/material";
import React from "react";
import { Card } from "antd";

export default function CustomerStatsCard({
  customerStatsCardTitle,
  customerStatsCardDetails,
  loading = false,
  language,
  className = "",
}) {
  let iconComponent, titleColor, amountColor;

  // Dynamically set the colors based on customerStatsCardTitle
  switch (customerStatsCardTitle) {
    case language === "ar" ? "إجمالي الطلبات" : "Total des commandes":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      titleColor = "#007bff"; // Blue for orders
      amountColor = "#007bff"; // Blue for amount
      break;
    case language === "ar" ? "إجمالي المشتريات" : "Total des achats":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      titleColor = "#007bff"; // Blue for purchases
      amountColor = "#007bff"; // Blue for amount
      break;
    case language === "ar" ? "إجمالي المدفوع" : "Total payé":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#28a745"; // Green for paid
      amountColor = "#28a745"; // Green for amount
      break;
    case language === "ar" ? "إجمالي غير المدفوع" : "Total impayé":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#ff9800"; // Orange for unpaid
      amountColor = "#ff9800"; // Orange for amount
      break;
    case language === "ar" ? "إجمالي الأرباح" : "Total des bénéfices":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#008080"; // Teal for profit
      amountColor = "#008080"; // Teal for amount
      break;
    case language === "ar" ? "إجمالي المبلغ" : "Montant total":
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#6c757d"; // Gray for total amount
      amountColor = "#6c757d"; // Gray for amount
      break;
    default:
      iconComponent = <BanknotesIcon className="iconPages" />;
      titleColor = "#000"; // Gray for default
      amountColor = "#000"; // Gray for amount
      break;
  }

  // Handle span component for currency
  let spanComponent =
    customerStatsCardTitle ===
      (language === "ar" ? "إجمالي الطلبات" : "Total des commandes") ||
    customerStatsCardTitle ===
      (language === "ar" ? "إجمالي المشتريات" : "Total des achats")
      ? ""
      : language === "ar"
      ? " دج"
      : " DA";

  // Handle value formatting for "Total Unpaid" to remove the "-" if zero
  const displayDetails =
    customerStatsCardTitle ===
      (language === "ar" ? "إجمالي غير المدفوع" : "Total impayé") &&
    customerStatsCardDetails === 0
      ? "0"
      : customerStatsCardDetails;

  return (
    <>
      {!loading ? (
        <Card
          style={{
            height: "180px",
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
                className="dashboardCardTitle flex items-center"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  color: titleColor,
                }}
              >
                {customerStatsCardTitle}
              </h3>
              {iconComponent}
            </div>
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
                color: amountColor,
              }}
              className="dashboardCardAmount"
            >
              {displayDetails}
              {spanComponent}
            </h2>
          </div>
        </Card>
      ) : (
        <Card
          style={{
            height: "180px",
            borderRadius: 20,
          }}
          className={className}
        >
          <div className="w-full h-[140px] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        </Card>
      )}
    </>
  );
}
