import React from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export default function OrderStatus({ orderDetails }) {
  // Function to get the background color based on the current index and status
  const getBackgroundColor = (status, index) => {
    return index <= status ? "checkCercleActive" : "checkCercle";
  };

  const statusSteps = [
    {
      label: "Order Placed",
      icon: <ClipboardDocumentCheckIcon className="iconAsideBar" />,
    },
    {
      label: "Preparing your order",
      icon: <ArchiveBoxArrowDownIcon className="iconAsideBar" />,
    },
    {
      label: "Order on the way to address",
      icon: <TruckIcon className="iconAsideBar" />,
    },
    { label: "Delivered", icon: <ArchiveBoxIcon className="iconAsideBar" /> },
  ];

  return (
    <div className="customerClass">
      <h2 className="customerClassTitle">Order Status</h2>
      <div className="orderStatus">
        <div className="timeLineStatus">
          <span className="timeLineStatusSpan">Timeline</span>
        </div>
        <div className="orderStatusItems">
          {statusSteps.map((step, index) => (
            <div className="orderStatusItem" key={index}>
              <div
                className={`checkCercle ${getBackgroundColor(
                  orderDetails.status,
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
