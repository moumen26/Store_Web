import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import OrderProfileDetails from "../components/OrderProfileDetails";
import { PhoneIcon } from "@heroicons/react/24/outline";
import OrderProfileDevicesProductTable from "../components/OrderProfileDevicesProductTable";
import ButtonExportPDF from "../components/ButtonExportPdf";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import { useQuery } from "@tanstack/react-query";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import PaymentHistorique from "../components/PaymentHistorique";
import ConfirmDialog from "../components/ConfirmDialog";
import { Alert, Snackbar, TextField, Typography } from "@mui/material";
import axios from "axios";
import ButtonModify from "../components/ButtonModify";
import { TokenDecoder } from "../util/DecodeToken";
import AddOrderRetunsTableDetails from "../components/AddOrderRetunsTableDetails";
import RetireButton from "../components/RetireButton";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function OrderProfile({ onToggle, language, toggleLanguage }) {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState("");

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setDeliveryAmount("");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setDeliveryAmount("");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [Amount, setAmount] = useState(0);
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const [isAddAmountConfirmDialogOpen, setIsAddAmountConfirmDialogOpen] =
    useState(false);
  const handleOpenAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(true);
  };
  const handleCloseAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(false);
    setAmount(0);
  };

  const [isFullyPaidConfirmationOpen, setisFullyPaidConfirmationOpen] =
    useState(false);
  const handleOpenFullyPaidDialog = () => {
    setisFullyPaidConfirmationOpen(true);
  };
  const handleCloseFullyPaidConfirmationDialog = () => {
    setisFullyPaidConfirmationOpen(false);
  };

  const [isAddPaymentDialogOpen, setisAddPaymentDialogOpen] = useState(false);
  const handleOpenAddPaymentDialog = () => {
    setisAddPaymentDialogOpen(true);
  };
  const handleCloseAddPaymentDialog = () => {
    setisAddPaymentDialogOpen(false);
  };

  const [isDepositConfirmDialogOpen, setisDepositConfirmDialogOpen] =
    useState(false);
  const handleOpenDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(true);
  };
  const handleCloseDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(false);
  };

  const [isUnDepositConfirmDialogOpen, setisUnDepositConfirmDialogOpen] =
    useState(false);
  const handleOpenUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(true);
  };
  const handleCloseUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(false);
  };

  const [isCreditedConfirmDialogOpen, setisCreditedConfirmDialogOpen] =
    useState(false);
  const handleOpenCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(true);
  };
  const handleCloseCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(false);
  };

  const [isUnCreditedConfirmDialogOpen, setisUnCreditedConfirmDialogOpen] =
    useState(false);
  const handleOpenUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(true);
  };
  const handleCloseUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(false);
  };

  const [
    isUpdateReceiptstatusConfirmDialogOpen,
    setisUpdateReceiptstatusConfirmDialogOpen,
  ] = useState(false);
  const handleOpenUpdateReceiptstatusConfirmDialogOpen = () => {
    setisUpdateReceiptstatusConfirmDialogOpen(true);
  };
  const handleCloseUpdateReceiptstatusConfirmDialogOpen = () => {
    setisUpdateReceiptstatusConfirmDialogOpen(false);
  };

  //Modify the order
  const [modifyOrderModal, setModifyOrderModal] = useState(false);

  const handleOpenModifyOrderModal = () => {
    setModifyOrderModal(true);
  };

  const handleCloseModifyOrderModal = () => {
    setModifyOrderModal(false);
  };

  //Add retuns
  const [addRetunsModal, setAddRetunsModal] = useState(false);

  const handleOpenAddRetunsModal = () => {
    setAddRetunsModal(true);
  };

  const handleCloseAddRetunsModal = () => {
    setAddRetunsModal(false);
  };

  const [retireOrder, setRetireOrder] = useState(false);

  const handleOpenRetireOrderModal = () => {
    setRetireOrder(true);
  };

  const handleCloseRetireOrderModal = () => {
    setRetireOrder(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [productsListToUpdate, setProductsListToUpdate] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  //fetch data
  const fetchOrderData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/${id}/${decodedToken?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: refetchOrderData,
  } = useQuery({
    queryKey: ["OrderData", user?.token, location.key, id],
    queryFn: fetchOrderData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //fetch data
  const fetchOrderStatusData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/ReceiptStatus/all/${id}/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrderStatusData,
    error: OrderStatusDataError,
    isLoading: OrderStatusDataLoading,
    refetch: refetchOrderStatusData,
  } = useQuery({
    queryKey: ["OrderStatusData", user?.token, location.key, id],
    queryFn: fetchOrderStatusData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //add full payment API
  const handleOnConfirmFullyPaid = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/full/payment/${id}/${decodedToken.id}`,
        {},
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
        handleCloseFullyPaidConfirmationDialog();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error adding new payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding new payment");
      }
    }
  };

  //add payment API
  const handleOnConfirmAddPayment = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/payment/${id}/${decodedToken.id}`,
        {
          amount: Amount,
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
        handleCloseAddAmountConfirmationDialog();
        handleCloseAddPaymentDialog();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error adding new payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding new payment");
      }
    }
  };

  //add payment API
  const handleOnDepositConfirm = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/deposit/${id}/${decodedToken.id}`,
        {
          deposit: val,
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
        handleCloseDepositConfirmationDialog();
        handleCloseUnDepositConfirmationDialog();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error(
          "Error updating taking without paying: No response received"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating taking without paying");
      }
    }
  };

  //make it credited API
  const handleOnConfirmCredited = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/credit/${id}/${decodedToken.id}`,
        {
          credited: val,
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
        handleCloseCreditedConfirmationDialog();
        handleCloseUnCreditedConfirmationDialog();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating credited: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating credited");
      }
    }
  };

  //update receipt status API
  const handleUpdateReceiptStatus = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/ReceiptStatus/create/${id}/${decodedToken.id}`,
        {
          products: productsListToUpdate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderStatusData();
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseModifyOrderModal();
        handleCloseUpdateReceiptstatusConfirmDialogOpen();
        setProductsListToUpdate([]);
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating receipt status: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating receipt status");
      }
    }
  };
  //cancel order API
  const handleCancelOrder = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/cancel/${decodedToken.id}/${id}`,
        {},
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
        handleCloseRetireOrderModal();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error cancel receipt: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error cancel receipt");
      }
    }
  };

  // Add Delivery Price
  const AddDelivryPrice = async () => {
    if (
      !deliveryAmount ||
      isNaN(deliveryAmount) ||
      Number(deliveryAmount) < 0
    ) {
      setAlertType("error");
      setAlertMessage(
        language === "ar"
          ? "يرجى إدخال مبلغ صالح أكبر من 0"
          : "Veuillez saisir un montant valide supérieur à 0"
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/updateExpectedDeliveryCost/${id}/${decodedToken?.id}`,
        {
          deliveredAmount: Number(deliveryAmount),
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
        handleClosePopup();
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
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating receipt: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating receipt");
      }
    }
  };

  if (OrderDataLoading || OrderStatusDataLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <Header />
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
          {/* <h1>Loading...</h1> */}
        </div>
      </div>
    );
  }

  if (OrderDataError || OrderStatusDataError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="customerClass">
          <h2 className="customerClassTitle">no data is available</h2>
        </div>
      </div>
    );
  }
  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="flexHeader">
        <div onClick={onToggle} className="equalsIcon">
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header toggleLanguage={toggleLanguage} language={language} />
      </div>
      <div id="exportable-content" className="space-y-[32px]">
        <div className="titlePageButton">
          <div className="flex items-center space-x-1">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الطلبات" : "Commandes"}
            </span>
            {language === "ar" ? (
              <ChevronLeftIcon className="iconAsideBar" />
            ) : (
              <ChevronRightIcon className="iconAsideBar" />
            )}
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              #{OrderData?._id}
            </span>
          </div>
          <div className="orderProfileButtons">
            {OrderData?.status == 0 && (
              <RetireButton
                language={language}
                showIcon={true}
                buttonSpan={
                  language === "ar" ? "إلغاء الطلب" : "Annuler la commande"
                }
                onClick={handleOpenRetireOrderModal}
              />
            )}
            {OrderData?.status >= 0 && (
              <ButtonModify
                language={language}
                showIcon={true}
                buttonSpan={
                  language === "ar" ? "تعديل الطلب" : "Modifier la commande"
                }
                onClick={handleOpenModifyOrderModal}
              />
            )}
            <ButtonExportPDF
              filename={language === "ar" ? "ملف_الطلب" : "Commande"}
              customerName={`${OrderData?.client.firstName}_${OrderData?.client.lastName}`}
              orderId={OrderData?._id}
              language={language}
              orderData={OrderData}
              orderStatusData={OrderStatusData}
              type="order"
            />
            <ButtonAdd
              language={language}
              showIcon={false}
              buttonSpan={
                language === "ar" ? "سجل الدفعات" : "Historique des paiements"
              }
              onClick={handleOpenModal}
            />
          </div>
        </div>
        <div
          className="customerClass paddingClass"
          style={{
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          }}
        >
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "تفاصيل الطلب" : "Détails de la commande"}
          </h2>
          <OrderProfileDetails
            language={language}
            orderDetails={OrderData}
            handleOpenPopup={handleOpenPopup}
          />
        </div>
        <div
          className={`flex h-full orderProfileMedia ${
            language === "ar" ? "gap-x-0 sm:gap-x-6" : "gap-x-0 sm:space-x-6"
          }`}
        >
          <div
            className="customerClass paddingClass w-[65%]"
            style={{
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <h2
              className="customerClassTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "المنتجات في الطلب"
                : "Produits dans la commande"}
            </h2>
            {OrderStatusData?.map((status) => (
              <OrderProfileDevicesProductTable
                orderDetails={status?.products}
                orderDeliveryAmount={OrderData?.deliveryCost}
                language={language}
              />
            ))}
          </div>
          <div className="w-[35%] flex-col space-y-[32px]">
            <div
              className="customerClass paddingClass"
              style={{
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                boxShadow:
                  "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
              }}
            >
              <h2
                className="customerClassTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "العميل" : "Client"}
              </h2>
              <div className="flex-col space-y-1">
                <span
                  className="dashboardLatestOrdersDetails"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "رقم الهاتف" : "Numéro du téléphone"}
                </span>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="iconAsideBar text-[#888888]" />
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {OrderData?.client.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex-col space-y-1">
                <span
                  className="dashboardLatestOrdersDetails"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "العنوان الافتراضي"
                    : "Adresse par défaut"}
                </span>
                <div className="flex-col space-y-1">
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {OrderData?.deliveredLocation
                      ? OrderData?.deliveredLocation?.address
                      : language === "ar"
                      ? "استلام"
                      : "Retrait"}
                  </p>
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {OrderData?.client.commune} {OrderData?.client.wilaya}
                  </p>
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "الجزائر" : "Algérie"}
                  </p>
                </div>
              </div>
            </div>
            <OrderStatus
              orderDetails={OrderData}
              user={user}
              refetchOrderData={refetchOrderData}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* Payment History Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel={
          language === "ar" ? "سجل الدفعات" : "Historique des paiements"
        }
        className="addNewModal PaymentHistory"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div
          className="customerClass"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          {/* Header Section - Responsive */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full customerButtons space-y-4 md:space-y-0">
            {/* Title */}
            <h2
              className="customerClassTitle text-center md:text-left"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "سجل الدفعات" : "Historique des paiements"}
            </h2>

            {/* Action Buttons or Status */}
            {OrderData.status != 10 ? (
              <div
                className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 buttonsMedia w-full md:w-auto ${
                  language === "ar" ? "" : ""
                }`}
              >
                {/* Deposit Button Logic */}
                {OrderData.credit == true
                  ? null
                  : OrderData.deposit == false
                  ? OrderData?.status >= 0 && (
                      <ButtonAdd
                        showIcon={false}
                        language={language}
                        buttonSpan={
                          language === "ar"
                            ? "تعيين كعربون"
                            : "Définir comme acompte"
                        }
                        onClick={handleOpenDepositConfirmationDialog}
                      />
                    )
                  : OrderData?.status >= 0 && (
                      <ButtonAdd
                        showIcon={false}
                        language={language}
                        buttonSpan={
                          language === "ar"
                            ? "إلغاء العربون"
                            : "Annuler l'acompte"
                        }
                        onClick={handleOpenUnDepositConfirmationDialog}
                      />
                    )}

                {/* Credit Button Logic */}
                {OrderData.deposit == true
                  ? null
                  : OrderData.credit == false
                  ? OrderData?.status >= 0 && (
                      <ButtonAdd
                        showIcon={false}
                        language={language}
                        buttonSpan={
                          language === "ar"
                            ? "تعيين كآجل"
                            : "Définir comme crédit"
                        }
                        onClick={handleOpenCreditedConfirmationDialog}
                      />
                    )
                  : OrderData?.status >= 0 && (
                      <ButtonAdd
                        showIcon={false}
                        language={language}
                        buttonSpan={
                          language === "ar"
                            ? "إلغاء الآجل"
                            : "Annuler le crédit"
                        }
                        onClick={handleOpenUnCreditedConfirmationDialog}
                      />
                    )}

                {/* Payment Button Logic */}
                {OrderData.credit == true
                  ? OrderData?.status >= 0 && (
                      <ButtonAdd
                        showIcon={false}
                        language={language}
                        buttonSpan={
                          language === "ar"
                            ? "إضافة دفعة"
                            : "Ajouter un paiement"
                        }
                        onClick={handleOpenAddPaymentDialog}
                      />
                    )
                  : OrderData?.status >= 0 && (
                      <ButtonAdd
                        language={language}
                        showIcon={false}
                        buttonSpan={
                          language === "ar" ? "دفع كامل" : "Paiement complet"
                        }
                        onClick={handleOpenFullyPaidDialog}
                      />
                    )}
              </div>
            ) : (
              <h2
                className="customerClassTitle text-center md:text-right text-green-600"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "مدفوع بالكامل" : "Payé en totalité"}
              </h2>
            )}
          </div>

          {/* Payment History Section */}
          <div className="scrollProductHistorique mt-4">
            <PaymentHistorique
              language={language}
              data={OrderData.payment}
              isClosed={OrderData.status == 10 ? false : true}
            />
          </div>
        </div>

        {/* Footer Section - Responsive */}
        <div className="flex flex-col items-center mt-4 space-y-4 relative">
          {/* Totals - Stack on mobile, inline on desktop - Always centered */}
          <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-2 sm:gap-4">
            <h2
              className="customerClassTitle text-center"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المجموع :" : "Total :"}{" "}
              <span className="font-bold">
                {OrderData.total} {language === "ar" ? "دج" : "DA"}
              </span>
            </h2>
            <h2
              className="customerClassTitle text-center"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المتبقي :" : "Reste à payer :"}{" "}
              <span className="font-bold text-red-600">
                {OrderData.total -
                  OrderData.payment.reduce(
                    (sum, pay) => sum + pay.amount,
                    0
                  )}{" "}
                {language === "ar" ? "دج" : "DA"}
              </span>
            </h2>
          </div>

          {/* Close Button - Centered on mobile, positioned on desktop */}
          <button
            onClick={handleCloseModal}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className={`text-gray-500 cursor-pointer hover:text-gray-700 md:absolute md:bottom-0 ${
              language === "ar" ? "md:left-0" : "md:right-0"
            } bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200
                 w-full sm:w-auto md:w-auto md:bg-transparent md:hover:bg-transparent md:px-0 md:py-0 md:rounded-none`}
          >
            {language === "ar" ? "إغلاق" : "Fermer"}
          </button>
        </div>
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        isOpen={isAddPaymentDialogOpen}
        onRequestClose={handleCloseAddPaymentDialog}
        contentLabel={language === "ar" ? "إضافة دفعة" : "Ajouter un paiement"}
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div
          className="customerClass p-0"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "إضافة دفعة" : "Ajouter un paiement"}
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "مبلغ الدفعة :" : "Montant du paiement :"}
            </span>
            <div className="inputForm">
              <input
                type="number"
                name="amount"
                min={0}
                onChange={handleAmountChange}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          className={`flex justify-end mt-4 ${
            language === "ar" ? "gap-x-8" : "space-x-8"
          }`}
        >
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseAddPaymentDialog}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "إلغاء" : "Annuler"}
          </button>
          <button
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={handleOpenAddAmountConfirmationDialog}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "حفظ" : "Enregistrer"}
          </button>
        </div>
      </Modal>

      {/* Modify Order Modal */}
      <Modal
        isOpen={modifyOrderModal}
        onRequestClose={handleCloseModifyOrderModal}
        contentLabel={
          language === "ar" ? "إضافة مرتجعات" : "Ajouter des retours"
        }
        className="addNewModal addNewCustomerModal max-h-[90vh] overflow-y-auto p-0 w-[90%]"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div
          className="customerClass px-4 md:px-6 py-4 md:py-6"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <AddOrderRetunsTableDetails
            language={language}
            productsListToUpdate={productsListToUpdate}
            setProductsListToUpdate={setProductsListToUpdate}
          />
          <div className="mt-4 md:mt-6">
            <div
              className={`flex flex-col sm:flex-row ${
                language === "ar" ? "sm:gap-x-8" : "sm:space-x-8"
              } gap-y-4 sm:gap-y-0 justify-end`}
            >
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700 px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg sm:border-none sm:rounded-none sm:px-0 sm:py-0 order-2 sm:order-1"
                onClick={handleCloseModifyOrderModal}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "إلغاء" : "Annuler"}
              </button>
              <input
                type="button"
                value={language === "ar" ? "حفظ" : "Enregistrer"}
                className="text-white bg-blue-500 hover:bg-blue-700 cursor-pointer px-4 py-2 text-sm md:text-base rounded-lg sm:text-blue-500 sm:bg-transparent sm:hover:bg-transparent sm:hover:text-blue-700 sm:px-0 sm:py-0 sm:rounded-none order-1 sm:order-2"
                onClick={handleOpenUpdateReceiptstatusConfirmDialogOpen}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Payment History Modal */}
      <Modal
        isOpen={isPopupOpen}
        onRequestClose={handleClosePopup}
        contentLabel={
          language === "ar"
            ? "إضافة مبلغ التوصيل"
            : "Ajouter le montant de livraison"
        }
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div
          className="customerClass"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          {/* Header Section - Responsive */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full customerButtons space-y-4 md:space-y-0">
            {/* Title */}
            <h2
              className="customerClassTitle text-center md:text-left"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "إضافة مبلغ التوصيل"
                : "Ajouter le montant de livraison"}
            </h2>
            <div className="inputForm">
              <input
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                placeholder={
                  language === "ar" ? "أدخل المبلغ" : "Entrez le montant"
                }
                type="number"
                value={deliveryAmount}
                onChange={(e) => setDeliveryAmount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div
              className={`flex flex-col sm:flex-row ${
                language === "ar" ? "sm:gap-x-8" : "sm:space-x-8"
              } gap-y-4 sm:gap-y-0 justify-end`}
            >
              {!submitionLoading ? (
                <>
                  <button
                    className="text-gray-500 cursor-pointer hover:text-gray-700 px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg sm:border-none sm:rounded-none sm:px-0 sm:py-0 order-2 sm:order-1"
                    onClick={handleClosePopup}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <input
                    type="button"
                    value={language === "ar" ? "حفظ" : "Enregistrer"}
                    className="text-white bg-blue-500 hover:bg-blue-700 cursor-pointer px-4 py-2 text-sm md:text-base rounded-lg sm:text-blue-500 sm:bg-transparent sm:hover:bg-transparent sm:hover:text-blue-700 sm:px-0 sm:py-0 sm:rounded-none order-1 sm:order-2"
                    onClick={AddDelivryPrice}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  />
                </>
              ) : (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* All Confirm Dialogs */}
      <ConfirmDialog
        open={isFullyPaidConfirmationOpen}
        onConfirm={handleOnConfirmFullyPaid}
        onClose={handleCloseFullyPaidConfirmationDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد الدفع الكامل"
            : "Confirmer le paiement complet"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تأكيد الدفع الكامل؟"
            : "Êtes-vous sûr de vouloir confirmer le paiement complet ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={retireOrder}
        onConfirm={handleCancelOrder}
        onClose={handleCloseRetireOrderModal}
        dialogTitle={
          language === "ar" ? "تأكيد الإلغاء" : "Confirmer l'annulation"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟"
            : "Êtes-vous sûr de vouloir annuler cette commande ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isAddAmountConfirmDialogOpen}
        onConfirm={handleOnConfirmAddPayment}
        onClose={handleCloseAddAmountConfirmationDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد إضافة الدفعة"
            : "Confirmer l'ajout du paiement"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(true)}
        onClose={handleCloseDepositConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد كعربون" : "Confirmer comme acompte"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تأكيد البيع كعربون؟"
            : "Êtes-vous sûr de vouloir confirmer comme vente avec acompte ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUnDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(false)}
        onClose={handleCloseUnDepositConfirmationDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد إلغاء العربون"
            : "Confirmer l'annulation de l'acompte"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد إلغاء البيع كعربون؟"
            : "Êtes-vous sûr de vouloir annuler la vente avec acompte ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(true)}
        onClose={handleCloseCreditedConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد كآجل" : "Confirmer comme crédit"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تأكيد البيع كآجل؟"
            : "Êtes-vous sûr de vouloir confirmer comme vente à crédit ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUnCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(false)}
        onClose={handleCloseUnCreditedConfirmationDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد إلغاء الآجل"
            : "Confirmer l'annulation du crédit"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد إلغاء البيع كآجل؟"
            : "Êtes-vous sûr de vouloir annuler la vente à crédit ?"
        }
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUpdateReceiptstatusConfirmDialogOpen}
        onConfirm={handleUpdateReceiptStatus}
        onClose={handleCloseUpdateReceiptstatusConfirmDialogOpen}
        dialogTitle={
          language === "ar"
            ? "تأكيد تعديل الفاتورة"
            : "Confirmer la modification du reçu"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تعديل هذه الفاتورة؟"
            : "Êtes-vous sûr de vouloir modifier ce reçu ?"
        }
        isloading={submitionLoading}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType}>
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {alertMessage}
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}
