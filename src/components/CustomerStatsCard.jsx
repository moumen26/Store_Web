import { BanknotesIcon, DocumentChartBarIcon } from "@heroicons/react/16/solid";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function CustomerStatsCard({
  customerStatsCardTitle,
  customerStatsCardDetails,
  loading,
}) {
  let iconComponent;

  switch (customerStatsCardTitle) {
    case "Total Orders":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      break;
    case "Total Purchases":
      iconComponent = <DocumentChartBarIcon className="iconPages" />;
      break;
    default:
      iconComponent = <BanknotesIcon className="iconPages" />;
      break;
  }

  let spanComponent;

  switch (customerStatsCardTitle) {
    case "Total Orders":
      spanComponent = "";
      break;
    case "Total Purchases":
      spanComponent = "";
      break;
    default:
      spanComponent = spanComponent = " DA";
  }
  return (
    <div className="customerStatsCard">
      {!loading ? 
        <>
          <div className="flex justify-between items-center">
            <h3 className="dashboardCardTitle flex items-center h-[50px]">
              {customerStatsCardTitle}
            </h3>
            <div className="bg-white w-[50px] h-[50px] rounded-lg flex items-center justify-center">
              {iconComponent}
            </div>
          </div>
          <span className="dashboardCardAmount">
            {customerStatsCardDetails}
            {spanComponent}
          </span>
        </>
      :
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
          {/* <h1>Loading...</h1> */}
        </div>
      }
    </div>
  );
}
