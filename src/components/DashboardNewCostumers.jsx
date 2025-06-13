import React from "react";
import DashboardNewCostumerItem from "./DashboardNewCostumerItem";
import { CircularProgress } from "@mui/material";

export default function DashboardNewCostumers({
  LastNewAccessCustomers,
  LastNewAccessCustomersLoading,
  language,
}) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
      className={`dashboardNewCostumers ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="w-full flex items-center justify-between">
        <h3
          className="dashboardTitleItem"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "fr" ? "Nouveaux clients" : "الزبائن الجدد"}
        </h3>
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
                  ? "Aucun client disponible"
                  : "لا يوجد عملاء متاحون"}
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
