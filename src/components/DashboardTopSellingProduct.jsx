import React from "react";
import DashboardTopSellingProductItem from "./DashboardTopSellingProductItem";
import { CircularProgress } from "@mui/material";

export default function DashboardTopSellingProduct({
  TopSellingStocks,
  TopSellingStocksLoading,
  language,
}) {
  return (
    <div
      style={{
        borderRadius: 10,
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
            ? "Produits les plus vendus"
            : "المنتجات الأكثر مبيعًا"}
        </h3>
      </div>
      <div className="dashboardProductClass">
        {!TopSellingStocksLoading ? (
          TopSellingStocks?.length > 0 ? (
            TopSellingStocks.map((product, index) => (
              <DashboardTopSellingProductItem
                key={product.stock._id}
                ProductImage={product.stock?.product?.image}
                ProductName={
                  product.stock?.product?.name +
                  " " +
                  product?.stock?.product?.size
                }
                ProductBrand={product.stock?.product?.brand?.name}
                ProductSales={product?.totalQuantity}
                ProductStocks={product.stock?.quantity}
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
                  ? "Aucun produit trouvé"
                  : "لم يتم العثور على أي منتج"}
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
