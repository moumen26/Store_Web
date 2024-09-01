import React from "react";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline"; // Use ClockIcon for pending and CheckIcon for completed

export default function PurchaseStatus({ purchaseDetails }) {
  const getBackgroundColor = (status, index) => {
    return index <= status ? "checkCercleActive" : "checkCercle";
  };

  const statusSteps = [
    {
      label: "Pending",
      icon: <ClockIcon className="iconAsideBar" />,
    },
    {
      label: "Completed",
      icon: <CheckIcon className="iconAsideBar" />,
    },
  ];

  return (
    <div className="customerClass">
      <h2 className="customerClassTitle">Purchase Status</h2>
      <div className="orderStatus">
        <div className="timeLineStatus">
          <span className="timeLineStatusSpan">Timeline</span>
        </div>
        <div className="orderStatusItems">
          {statusSteps.map((step, index) => (
            <div className="orderStatusItem" key={index}>
              <div
                className={`checkCercle ${getBackgroundColor(
                  purchaseDetails.status,
                  index
                )}`}
              >
                <CheckIcon className="orderStatusIcon" />
              </div>
              <div className="flex w-[85%] justify-between items-center">
                <div className="orderStatusItemSpans">
                  <span className="trTableSpan">{step.label}</span>
                  <span className="thTableSpan">May 09, 2024 | 02:00 PM</span>
                </div>
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
