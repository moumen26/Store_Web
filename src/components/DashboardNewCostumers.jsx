import React from "react";
import DashboardNewCostumerItem from "./DashboardNewCostumerItem";
import { CircularProgress } from "@mui/material";

const newCostumerData = [
  {
    CostumerName: "Khaldi Abdelmoumen",
    CostumerId: "0920496",
  },
  {
    CostumerName: "Boumrar Zineddein",
    CostumerId: "0920496",
  },
  {
    CostumerName: "Khaldi Abdelmoumen",
    CostumerId: "0920496",
  },
];

export default function DashboardNewCostumers({
  LastNewAccessCustomers,
  LastNewAccessCustomersLoading,
}) {
  return (
    <div className="dashboardNewCostumers">
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">New Costumers</h3>
      </div>
      <div className="flex-col h-[410px] space-y-6">
        {!LastNewAccessCustomersLoading ? (
          LastNewAccessCustomers?.length > 0 ? (
            LastNewAccessCustomers.map((costumer, index) => (
              <DashboardNewCostumerItem
                key={index}
                CostumerName={
                  costumer.user?.firstName + " " + costumer.user?.lastName
                }
                CostumerId={costumer.user?._id}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="thTableSpan">No ccustomer available</span>
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
