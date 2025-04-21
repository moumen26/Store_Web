import { CircularProgress } from "@mui/material";
import React from "react";
import { Card } from "antd";

export default function OrderCard({
  orderCardTitle,
  orderCardDetails,
  loading = false,
  language,
  className = "",
}) {
  return (
    <>
      {!loading ? (
        <Card
          style={{
            height: "180px",
            borderRadius: 20,
          }}
          className={`responsive-card ${className}`}
        >
          <div className="w-full h-[140px] flex flex-col justify-between">
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="dashboardCardTitle"
            >
              {orderCardTitle}
            </h3>
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="dashboardCardAmount"
            >
              {orderCardDetails}
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
