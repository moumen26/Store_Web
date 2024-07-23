import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import React from "react";

export default function DashboardNewCostumerItem({ CostumerName, CostumerId }) {
  return (
    <div className="flex items-center justify-between pl-[20px] pr-[20px]">
      <div className="flex items-center space-x-3">
        <div className="w-[50px] h-[50px] rounded-md bg-red-500 flex items-center justify-center">
          <span className="alphSpan">KA</span>
        </div>
        <div className="flex-col space-y-1">
          <h3 clcassName="dashboardText">{CostumerName}</h3>
          <p className="dashboardSpan">Customer ID #{CostumerId}</p>
        </div>
      </div>
      <EllipsisVerticalIcon className="iconAsideBar" />
    </div>
  );
}
