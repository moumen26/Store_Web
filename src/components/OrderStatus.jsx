import React, { useState } from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { TokenDecoder } from "../util/DecodeToken";

export default function OrderStatus({ orderDetails, user, refetchOrderData }) {
  const decodedToken = TokenDecoder();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getBackgroundColor = (status, index) => {
    return index <= status ? "checkCercleActive" : "checkCercle";
  };

  const statusSteps = [
    {
      label: "Order Placed",
      icon: !submitionLoading ? <ClipboardDocumentCheckIcon className="iconAsideBar"
        onClick={() => handleSubmitStatusProgress(0)}
      /> : null,
    },
    {
      label: "Preparing your order",
      icon: !submitionLoading ? <ArchiveBoxArrowDownIcon className="iconAsideBar"
        onClick={() => handleSubmitStatusProgress(1)}
      /> : null,
    },
    {
      label: "Order on the way to address",
      icon: !submitionLoading ? <TruckIcon className="iconAsideBar"
        onClick={() => handleSubmitStatusProgress(2)}
      /> : null,
    },
    {
      label: "Ready for Pickup",
      icon: !submitionLoading ? <TruckIcon className="iconAsideBar"
        onClick={() => handleSubmitStatusProgress(2)}
      /> : null,
    },
    {
      label: orderDetails.type === "pickup" ? "Pickup" : "Delivered",
      icon: <ArchiveBoxIcon className="iconAsideBar"/>,
    },
  ];

  const stepsToShow =
    orderDetails.type === "pickup"
      ? [statusSteps[0], statusSteps[3]]
      : [statusSteps[0], statusSteps[1], statusSteps[2], statusSteps[4]];

  //----------------------APIs----------------------
  const handleSubmitStatusProgress = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Receipt/status/${decodedToken.id}`,
        {
          id: orderDetails._id,
          status: val,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating status: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating status", error);
      }
    } finally {
      setSubmitionLoading(false);
    }
  };
  return (
    <div className={`customerClass ${orderDetails.type}`}>
      <h2 className="customerClassTitle">Order Status</h2>
      <div className="orderStatus">
        <div className="timeLineStatus">
          <span className="timeLineStatusSpan">Timeline</span>
        </div>
        <div className="orderStatusItems">
          {stepsToShow.map((step, index) => (
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
                </div>
                {
                  step.icon
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
