import React, { useState } from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { TokenDecoder } from "../util/DecodeToken";
import { Steps } from "antd";
import "antd/dist/reset.css";

export default function OrderStatus({
  orderDetails,
  user,
  refetchOrderData,
  language,
}) {
  const decodedToken = TokenDecoder();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const statusSteps = [
    {
      title: language === "ar" ? "تم الطلب" : "Commande passée",
      icon: !submitionLoading ? (
        <ClipboardDocumentCheckIcon
          className="iconAsideBar"
          onClick={() => handleSubmitStatusProgress(0)}
        />
      ) : null,
    },
    {
      title:
        language === "ar" ? "تحضير الطلب" : "Préparation de votre commande",
      icon: !submitionLoading ? (
        <ArchiveBoxArrowDownIcon
          className="iconAsideBar"
          onClick={() => handleSubmitStatusProgress(1)}
        />
      ) : null,
    },
    {
      title: language === "ar" ? "الطلب في الطريق" : "Commande en route",
      icon: !submitionLoading ? (
        <TruckIcon
          className="iconAsideBar"
          onClick={() => handleSubmitStatusProgress(2)}
        />
      ) : null,
    },
    {
      title: language === "ar" ? "جاهز للاستلام" : "Prêt à être récupéré",
      icon: !submitionLoading ? (
        <TruckIcon
          className="iconAsideBar"
          onClick={() => handleSubmitStatusProgress(2)}
        />
      ) : null,
    },
    {
      title:
        orderDetails.type === "pickup"
          ? language === "ar"
            ? "تم الاستلام"
            : "Récupéré"
          : language === "ar"
          ? "تم التوصيل"
          : "Livré",
      icon: <CheckCircleIcon className="iconAsideBar" />,
    },
    {
      title: language === "ar" ? "تم الإرجاع" : "Retourné",
      icon: <ArrowUturnLeftIcon className="iconAsideBar" />,
    },
    {
      title: language === "ar" ? "تم الدفع بالكامل" : "Entièrement payé",
      icon: <CheckBadgeIcon className="iconAsideBar" />,
    },
  ];

  const stepsToShow =
    orderDetails.type === "pickup"
      ? [
          statusSteps[0],
          statusSteps[1],
          statusSteps[3],
          statusSteps[4],
          statusSteps[5],
          statusSteps[6],
        ]
      : [
          statusSteps[0],
          statusSteps[1],
          statusSteps[2],
          statusSteps[4],
          statusSteps[5],
          statusSteps[6],
        ];

  //----------------------APIs----------------------
  const handleSubmitStatusProgress = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL_BASE}/Receipt/status/${
          decodedToken.id
        }`,
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
        console.error("Error updating status: No response received");
      } else {
        console.error("Error updating status", error);
      }
    } finally {
      setSubmitionLoading(false);
    }
  };

  return (
    <div
      className={`customerClass paddingClass pb-0 ${orderDetails.type}`}
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <h2 className="customerClassTitle">
        {language === "ar" ? "حالة الطلب" : "Statut de la commande"}
      </h2>
      <Steps
        direction="vertical"
        size="small"
        current={orderDetails.status}
        className="w-[100%] pl-6 custom-steps"
        items={stepsToShow.map((step) => ({
          title: (
            <div className="flex w-[290px] justify-between items-center">
              <span>{step.title}</span>
              {step.icon}
            </div>
          ),
        }))}
      />

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
