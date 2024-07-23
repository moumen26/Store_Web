import React from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import DashboardCard from "../components/DashboardCard";
import SalesChart from "../components/DashboardChart";
import DashboardTopSellingProduct from "../components/DashboardTopSellingProduct";
import DashboardLatestOrders from "../components/DashboardLatestOrders";
import DashboadStoreStatistic from "../components/DashboadStoreStatistic";
import DashboardNewCostumers from "../components/DashboardNewCostumers";
import DashboardChart from "../components/DashboardChart";

export default function Dashboard() {
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex-col space-y-[6px]">
          <h2 className="pagesTitle">Welcome back, Hichem</h2>
          <span className="pagesSousTitle">
            Here's you current sales overview
          </span>
        </div>
        <Search placeholder="Search.." />
      </div>
      <div className="flex items-center space-x-6">
        <DashboardCard
          dashboardCardTitle="Avg. Order Value"
          dashboardCardAmount={0}
        />
        <DashboardCard
          dashboardCardTitle="Total Orders"
          dashboardCardAmount={0}
        />
        <DashboardCard
          dashboardCardTitle="Total Amount"
          dashboardCardAmount={0}
        />
      </div>
      <div className="flex items-center justify-between space-x-6">
        <DashboardChart />
        <DashboardTopSellingProduct />
      </div>
      <DashboardLatestOrders />
      <div className="w-full flex justify-between space-x-6">
        <DashboadStoreStatistic />
        <DashboardNewCostumers />
      </div>
    </div>
  );
}
