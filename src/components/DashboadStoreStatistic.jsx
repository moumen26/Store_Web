import {
  ShoppingBagIcon,
  Square2StackIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function DashboadStoreStatistic({
  StatsData,
  StatsDataLoading
}) {
  return (
    <div className="dashboadStoreStatistic">
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">Store Statistics</h3>
      </div>
      <div className="flex-col h-[410px] space-y-6">
        {!StatsDataLoading ? (
          <>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3 clcassName="dashboardText">Total orders</h3>
                <p className="dashboardSpan">{StatsData?.totalReceipts}</p>
              </div>
              <div className="flex items-center justify-center">
                <ShoppingBagIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3 clcassName="dashboardText">Total stocks</h3>
                <p className="dashboardSpan">{StatsData?.totalStocks}</p>
              </div>
              <div className="flex items-center justify-center">
                <Square2StackIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3 clcassName="dashboardText">Total cutomers</h3>
                <p className="dashboardSpan">{StatsData?.totalCustomers}</p>
              </div>
              <div className="flex items-center justify-center">
                <UserGroupIcon className="iconAsideBar" />
              </div>
            </div>
            <div className="flex items-center justify-between pl-[20px] pr-[20px]">
              <div className="flex-col space-y-1">
                <h3 clcassName="dashboardText">Total vendors</h3>
                <p className="dashboardSpan">{StatsData?.totalSellers}</p>
              </div>
              <div className="flex items-center justify-center">
                <UserIcon className="iconAsideBar" />
              </div>
            </div>
          </>
        )
        : 
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        }
      </div>
    </div>
  );
}
