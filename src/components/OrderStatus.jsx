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
          className="iconAsideBar cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => handleSubmitStatusProgress(0)}
        />
      ) : null,
    },
    {
      title:
        language === "ar" ? "تحضير الطلب" : "Préparation de votre commande",
      icon: !submitionLoading ? (
        <ArchiveBoxArrowDownIcon
          className="iconAsideBar cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => handleSubmitStatusProgress(1)}
        />
      ) : null,
    },
    {
      title: language === "ar" ? "الطلب في الطريق" : "Commande en route",
      icon: !submitionLoading ? (
        <TruckIcon
          className="iconAsideBar cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => handleSubmitStatusProgress(2)}
        />
      ) : null,
    },
    {
      title: language === "ar" ? "جاهز للاستلام" : "Prêt à être récupéré",
      icon: !submitionLoading ? (
        <TruckIcon
          className="iconAsideBar cursor-pointer hover:text-blue-600 transition-colors"
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
      icon: <CheckCircleIcon className="iconAsideBar text-green-600" />,
    },
    {
      title: language === "ar" ? "تم الإرجاع" : "Retourné",
      icon: <ArrowUturnLeftIcon className="iconAsideBar text-red-600" />,
    },
    {
      title: language === "ar" ? "تم الدفع بالكامل" : "Entièrement payé",
      icon: <CheckBadgeIcon className="iconAsideBar text-green-600" />,
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
      style={{
        direction: language === "ar" ? "rtl" : "ltr",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      <h2
        className="customerClassTitle"
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
      >
        {language === "ar" ? "حالة الطلب" : "Statut de la commande"}
      </h2>

      {/* Simple Steps Layout */}
      <div className="w-full space-y-3">
        {stepsToShow.map((step, index) => (
          <div
            key={index}
            className={`flex items-center w-full py-2 ${
              language === "ar" ? "" : ""
            }`}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? (
              // Arabic layout: Number → Title → Icon
              <>
                {/* Number */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                    index === orderDetails.status
                      ? "bg-blue-500 text-white"
                      : index < orderDetails.status
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Title */}
                <span
                  className={`flex-1 text-sm md:text-base ${
                    index === orderDetails.status
                      ? "text-blue-600 font-medium"
                      : index < orderDetails.status
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>

                {/* Icon */}
                {step.icon && (
                  <div className="flex-shrink-0 ml-3">{step.icon}</div>
                )}
              </>
            ) : (
              // French layout: Number → Title → Icon
              <>
                {/* Number */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    language === "ar" ? "ml-3" : "mr-3"
                  } ${
                    index === orderDetails.status
                      ? "bg-blue-500 text-white"
                      : index < orderDetails.status
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Title */}
                <span
                  className={`flex-1 text-sm md:text-base ${
                    index === orderDetails.status
                      ? "text-blue-600 font-medium"
                      : index < orderDetails.status
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>

                {/* Icon */}
                {step.icon && (
                  <div className="flex-shrink-0 ml-3">{step.icon}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Custom Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .iconAsideBar {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertType}
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            direction: language === "ar" ? "rtl" : "ltr",
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
