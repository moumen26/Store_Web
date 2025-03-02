import React from "react";
import DashboardStocksAboutToFinishItem from "./DashboardStocksAboutToFinishItem";
import { CircularProgress } from "@mui/material";

export default function DashboardStocksAboutToFinish({
  StocksAboutToFinish,
  StocksAboutToFinishLoading,
}) {
  return (
    <div className="dashboardTopSellingProduct">
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">Stocks en rupture imminent</h3>
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
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="dashboardSpan">
                Aucun stock en rupture imminente disponible
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
