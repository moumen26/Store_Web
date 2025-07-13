import React from "react";
import { Card } from "antd";
import { CircularProgress } from "@mui/material";

export default function CustomerPrimaryDelivery({
  primaryDeliveryAddress,
  name,
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
              className="dashboardCardTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {name}
            </h3>
            <span
              className="primaryDeliveryAddressSpan dashboardCardAmount"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {primaryDeliveryAddress}
            </span>
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
