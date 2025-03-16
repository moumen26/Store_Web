import React from "react";

export default function DashboardStocksAboutToFinishItem({
  ProductImage,
  ProductName,
  ProductDestocking,
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
            src={`${import.meta.env.VITE_APP_URL_BASE.replace(
              "/api",
              ""
            )}/files/${ProductImage}`}
            alt={ProductImage}
          />
        </div>
        <div className="flex-col space-y-1">
          <h3 className="dashboardText">{ProductName}</h3>
          <p className="dashboardSpan">{ProductBrand}</p>
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
              : "غير متاح"}
          </span>
        </div>
        <span className="dashboardSpan">
          {ProductStocks}{" "}
          {language === "fr" ? "stock restant" : "المخزون المتبقي"}
        </span>
        {ProductDestocking > 0 && (
          <p className="dashboardSpan">
            {ProductDestocking} {language === "fr" ? "déstockage" : "تصفية"}
          </p>
        )}
      </div>
    </div>
  );
}
