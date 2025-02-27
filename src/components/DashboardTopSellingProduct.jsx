import React from "react";
import DashboardTopSellingProductItem from "./DashboardTopSellingProductItem";
import { CircularProgress } from "@mui/material";

export default function DashboardTopSellingProduct({
  TopSellingStocks,
  TopSellingStocksLoading
}) {
  return (
    <div className="dashboardTopSellingProduct">
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">Top Selling Product</h3>
      </div>
      <div className="dashboardProductClass">
        {!TopSellingStocksLoading ?
          TopSellingStocks?.length > 0 ?
            TopSellingStocks.map((product, index) => (
              <DashboardTopSellingProductItem
                key={product.stock._id}
                ProductImage={product.stock?.product?.image}
                ProductName={product.stock?.product?.name + " " + product?.stock?.product?.size}
                ProductBrand={product.stock?.product?.brand?.name}
                ProductSales={product?.totalQuantity}
                ProductStocks={product.stock?.quantity}
              />
            ))
            :
            <div className="w-full h-full flex items-center justify-center">
              <span className="dashboardSpan">No product found</span>
            </div>
          :
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        }
      </div>
    </div>
  );
}
