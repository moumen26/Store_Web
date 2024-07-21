import {
  ShoppingBagIcon,
  Square2StackIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import React from "react";

export default function DashboadStoreStatistic() {
  return (
    <div className="dashboadStoreStatistic">
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">Store Statistics</h3>
      </div>
      <div className="flex-col h-[410px] space-y-6">
        <div className="flex items-center justify-between pl-[20px] pr-[20px]">
          <div className="flex-col space-y-1">
            <h3 clcassName="dashboardText">Total Products</h3>
            <p className="dashboardSpan">200</p>
          </div>
          <div className="flex items-center justify-center">
            <Square2StackIcon className="iconAsideBar" />
          </div>
        </div>
        <div className="flex items-center justify-between pl-[20px] pr-[20px]">
          <div className="flex-col space-y-1">
            <h3 clcassName="dashboardText">Total Cutomers</h3>
            <p className="dashboardSpan">200</p>
          </div>
          <div className="flex items-center justify-center">
            <UserGroupIcon className="iconAsideBar" />
          </div>
        </div>
        <div className="flex items-center justify-between pl-[20px] pr-[20px]">
          <div className="flex-col space-y-1">
            <h3 clcassName="dashboardText">Total Orders</h3>
            <p className="dashboardSpan">200</p>
          </div>
          <div className="flex items-center justify-center">
            <ShoppingBagIcon className="iconAsideBar" />
          </div>
        </div>
        <div className="flex items-center justify-between pl-[20px] pr-[20px]">
          <div className="flex-col space-y-1">
            <h3 clcassName="dashboardText">Total Vendors</h3>
            <p className="dashboardSpan">200</p>
          </div>
          <div className="flex items-center justify-center">
            <UserIcon className="iconAsideBar" />
          </div>
        </div>
      </div>
    </div>
  );
}
