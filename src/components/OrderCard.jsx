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
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
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
