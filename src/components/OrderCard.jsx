import { CircularProgress } from "@mui/material";
import React from "react";
import { Card } from "antd";

export default function OrderCard({
  orderCardTitle,
  orderCardDetails,
  loading = false,
}) {
  return (
    <>
      {!loading ? (
        <Card
          style={{
            width: "25%",
            height: "180px",
            borderRadius: 20,
          }}
        >
          <div className="w-full h-[140px] flex flex-col justify-between">
            <h3 className="dashboardCardTitle">{orderCardTitle}</h3>
            <h2 className="dashboardCardAmount">{orderCardDetails}</h2>
          </div>
        </Card>
      ) : (
        <Card
          style={{
            width: "25%",
            height: 200,
            borderRadius: 20,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        </Card>
      )}
    </>
  );
}
