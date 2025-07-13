import React from "react";
import DashboardStocksAboutToFinishItem from "./DashboardStocksAboutToFinishItem";
import { CircularProgress } from "@mui/material";

export default function DashboardStocksAboutToFinish({
  StocksAboutToFinish,
  StocksAboutToFinishLoading,
  language,
}) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
      className={`dashboardTopSellingProduct ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="w-full flex items-center justify-between">
        <h3
          className="dashboardTitleItem"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "fr"
            ? "Stocks en rupture imminent"
            : "المنتج على وشك النفاد"}
        </h3>
      </div>
      <div className="dashboardProductClass">
        {!StocksAboutToFinishLoading ? (
          StocksAboutToFinish?.length > 0 ? (
            StocksAboutToFinish?.map((product, index) => (
              <DashboardStocksAboutToFinishItem
                key={product._id}
                ProductImage={product.product?.image}
                ProductName={
                  product.product?.name + " " + product?.product?.size
                }
                ProductBrand={product.product?.brand?.name}
                ProductDestocking={product?.destocking}
                ProductStocks={product?.quantity}
                language={language}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="thTableSpan text-center"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr"
                  ? "Aucun stock en rupture imminente disponible"
                  : "لا يوجد مخزون على وشك النفاد"}
              </span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
    </div>
  );
}
