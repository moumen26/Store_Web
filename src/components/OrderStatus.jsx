import React, { useState } from "react";
import { Steps } from "antd";
import {
  ClipboardDocumentCheckIcon,
  ArchiveBoxArrowDownIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { TokenDecoder } from "../util/DecodeToken";

export default function OrderStatus({
  orderDetails,
  user,
  refetchOrderData,
  language,
}) {
  const decodedToken = TokenDecoder();
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const isRTL = language === "ar";

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const statusSteps = [
    {
      title: language === "ar" ? "تم الطلب" : "Commande passée",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    },
    {
      title: language === "ar" ? "تحضير الطلب" : "Préparation",
      icon: <ArchiveBoxArrowDownIcon className="w-5 h-5" />,
    },
    {
      title:
        orderDetails.type === "pickup"
          ? language === "ar"
            ? "جاهز للاستلام"
            : "Prêt à récupérer"
          : language === "ar"
          ? "الطلب في الطريق"
          : "En route",
      icon: <TruckIcon className="w-5 h-5" />,
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
      icon: <CheckCircleIcon className="w-5 h-5" />,
    },
    {
      title: language === "ar" ? "تم الإرجاع" : "Retourné",
      icon: <ArrowUturnLeftIcon className="w-5 h-5" />,
      status: "error",
    },
    {
      title: language === "ar" ? "تم الدفع بالكامل" : "Entièrement payé",
      icon: <CheckBadgeIcon className="w-5 h-5" />,
    },
  ];

  const handleSubmitStatusProgress = async (current) => {
    if (current == 3 || current == 4) {
      setAlertType("error");
      setAlertMessage("Cette action n'est pas autorisée pour vous. cette action est réservée pour votre client.");
      setSnackbarOpen(true);
      return;
    }
    if (current == 5) {
      return;
    }

    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL_BASE}/Receipt/status/${
          decodedToken.id
        }`,
        {
          id: orderDetails._id,
          status: current,
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
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
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
      className="bg-white border border-gray-200 rounded-lg p-4 md:p-6"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-lg md:text-xl font-semibold text-gray-900"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "حالة الطلب" : "Statut de la commande"}
        </h2>
      </div>

      {/* Steps Component */}
      <Steps
        current={orderDetails.status}
        direction="vertical"
        size="small"
        className={`custom-steps ${isRTL ? "rtl-steps" : "ltr-steps"}`}
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        items={statusSteps.map((step, index) => ({
          title: step.title,
          icon: step.icon,
          status:
            index === 4 && orderDetails.status === 4
              ? "error"
              : index < orderDetails.status
              ? "finish"
              : index === orderDetails.status
              ? "process"
              : "wait",
          description:
            index === 4 &&
            orderDetails.status === 4 &&
            orderDetails.returnedRaison ? (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-800 mb-1">
                      {language === "ar" ? "سبب الإرجاع:" : "Raison du retour:"}
                    </p>
                    <p className="text-xs text-red-700">
                      {orderDetails.returnedRaison}
                    </p>
                  </div>
                </div>
              </div>
            ) : null,
        }))}
        onChange={(current) =>
          !submitionLoading && handleSubmitStatusProgress(current)
        }
      />

      {/* Snackbar */}
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

      {/* Global CSS Styles */}
      <style jsx global>{`
        /* Base step styling */
        .custom-steps .ant-steps-item-title {
          font-family: ${language === "ar"
            ? "Cairo-Regular, sans-serif"
            : "inherit"} !important;
        }

        .custom-steps .ant-steps-item-description {
          font-family: ${language === "ar"
            ? "Cairo-Regular, sans-serif"
            : "inherit"} !important;
        }

        .custom-steps .ant-steps-item-icon {
          border-color: #d1d5db;
        }

        .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #10b981;
          border-color: #10b981;
        }

        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .custom-steps .ant-steps-item-error .ant-steps-item-icon {
          background-color: #ef4444;
          border-color: #ef4444;
        }

        /* General step item adjustments for all screen sizes */
        .custom-steps .ant-steps-item {
          padding-bottom: 16px !important;
        }

        .custom-steps .ant-steps-item-container {
          display: flex !important;
          align-items: flex-start !important;
        }

        .custom-steps .ant-steps-item-content {
          display: flex !important;
          align-items: center !important;
          min-height: 32px !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
        }

        .custom-steps .ant-steps-item-title {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          line-height: 1.5 !important;
        }

        /* RTL (Arabic) layout - Icon right, title left - ALL SCREEN SIZES */
        .rtl-steps .ant-steps-item-content {
          flex-direction: row-reverse !important;
          justify-content: flex-end !important;
          margin-left: 0 !important;
        }

        .rtl-steps .ant-steps-item-title {
          text-align: right !important;
          margin-right: 0 !important;
          order: 1 !important;
        }

        /* LTR (French/English) layout - Icon left, title right - ALL SCREEN SIZES */
        .ltr-steps .ant-steps-item-content {
          flex-direction: row !important;
          justify-content: flex-start !important;
          margin-left: 12px !important;
          margin-right: 0 !important;
        }

        .ltr-steps .ant-steps-item-title {
          text-align: left !important;
          margin-left: 12px !important;
          margin-right: 0 !important;
          order: 2 !important;
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .custom-steps .ant-steps-item-title {
            white-space: nowrap !important;
          }
          
          
        }
      `}</style>
    </div>
  );
}
