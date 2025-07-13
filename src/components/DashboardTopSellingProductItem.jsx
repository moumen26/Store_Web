import React from "react";

export default function DashboardTopSellingProductItem({
  ProductImage,
  ProductName,
  ProductSales,
  ProductStocks,
  ProductBrand,
  language,
}) {
  return (
    <div
      className={`dashboardTopSellingProductItem ${
        language === "ar" ? "rtl" : ""
      }`}
    >
      <div className="flex items-center w-[50%]">
        <div className="productImgClass">
          <img
            className="productImg"
            src={`${import.meta.env.VITE_APP_FILES_URL}/${ProductImage}`}
            alt={ProductImage}
          />
        </div>
        <div className="flex-col space-y-1">
          <h3
            className="dashboardText"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {ProductName}
          </h3>
          <p
            className="dashboardSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {ProductBrand}
          </p>
        </div>
      </div>
      <div className="flex-col space-y-1 w-[50%] justifyEnd">
        <div
          className={`flex items-center ${
            language === "ar" ? "space-x-reverse space-x-1" : "space-x-1"
          }`}
        >
          <div
            className={
              ProductStocks > 0
                ? "cercleAvailable cercleAvailableGreen"
                : "cercleAvailable cercleAvailableRed"
            }
          ></div>
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className={
              ProductStocks > 0
                ? "spanAvailable spanAvailableGreen"
                : "spanAvailable spanAvailableRed"
            }
          >
            {ProductStocks > 0
              ? language === "fr"
                ? "Disponible"
                : "متاح"
              : language === "fr"
              ? "Indisponible"
              : "غير متاح"}{" "}
          </span>
        </div>
        <span
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
          className="dashboardSpan"
        >
          {ProductStocks}{" "}
          {language === "fr" ? "stock restant" : "المخزون المتبقي"}
        </span>
        <p
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
          className="dashboardSpan"
        >
          {ProductSales} {language === "fr" ? "ventes" : "مبيعات"}
        </p>
      </div>
    </div>
  );
}
