import { CircularProgress } from "@mui/material";
import React from "react";

export default function OrderCard({ orderCardTitle, orderCardDetails, loading = false }) {
  return (
    <>
      {!loading ?
        <div className="orderCard">
          <h3 className="dashboardCardTitle flex items-center h-[50px]">{orderCardTitle}</h3>
          <h2 className="dashboardCardAmount">{orderCardDetails}</h2>
        </div>
        :
        <div className="orderCard">
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        </div>
      }
    </>
  );
}
