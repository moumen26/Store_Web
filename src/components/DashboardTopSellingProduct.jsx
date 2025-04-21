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
