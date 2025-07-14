import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PhoneIcon } from "@heroicons/react/24/outline";
import ButtonExportPDF from "../components/ButtonExportPdf";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import PaymentHistorique from "../components/PaymentHistorique";
import PurchaseProfileDetails from "../components/PurchaseProfileDetails";
import PurchaseProfileDevicesProductTable from "../components/PurchaseProfileDevicesProductTable";
import { TokenDecoder } from "../util/DecodeToken";
import { EqualsIcon } from "@heroicons/react/16/solid";

import axios from "axios";
import { is } from "date-fns/locale";
import ConfirmDialog from "../components/ConfirmDialog";
import { Alert, Snackbar } from "@mui/material";
import ButtonModify from "../components/ButtonModify";
import AddPurchaseRetunsTableDetails from "../components/AddPurchaseRetunsTableDetails";
import ButtonRetour from "../components/ButtonRetour";

export default function PurchaseProfile({
  onToggle,
  toggleLanguage,
  language,
}) {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();

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

  const [isAddPaymentConfirmDialogOpen, setisAddPaymentConfirmDialogOpen] =
    useState(false);
  const handleOpenAddPaymentDialog = () => {
    setisAddPaymentConfirmDialogOpen(true);
  };
  const handleCloseAddPaymentConfirmationDialog = () => {
    setisAddPaymentConfirmDialogOpen(false);
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
    isUpdateSousPurchaseConfirmDialogOpen,
    setisUpdateSousPurchaseConfirmDialogOpen,
  ] = useState(false);
  const handleOpenUpdateSousPurchaseConfirmDialogOpen = () => {
    setisUpdateSousPurchaseConfirmDialogOpen(true);
  };
  const handleCloseUpdateSousPurchaseConfirmDialogOpen = () => {
    setisUpdateSousPurchaseConfirmDialogOpen(false);
  };

  //Modify the Purchase
  const [modifyPurchaseModal, setModifyPurchaseModal] = useState(false);

  const handleOpenModifyPurchaseModal = () => {
    setModifyPurchaseModal(true);
  };

  const handleCloseModifyPurchaseModal = () => {
    setModifyPurchaseModal(false);
  };

  //Retour Details the Purchase
  const [retourPurchase, setRetourPurchase] = useState(false);

  const handleOpenRetourPurchaseModal = () => {
    setRetourPurchase(true);
  };

  const handleCloseRetourPurchaseModal = () => {
    setRetourPurchase(false);
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
  const fetchPurchaseData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Purchase/${id}/${decodedToken.id}`,
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
        throw new Error("Error receiving Purchase data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: PurchaseData,
    error: PurchaseDataError,
    isLoading: PurchaseDataLoading,
    refetch: refetchPurchaseData,
  } = useQuery({
    queryKey: ["PurchaseData", user?.token, location.key, id],
    queryFn: fetchPurchaseData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //add payment API
  const handleOnConfirmFullyPaid = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Purchase/full/payment/${id}`,
        {
          store: decodedToken.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchPurchaseData();
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
        console.error("Error fully paid update: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error fully paid update");
      }
    }
  };

  //add payment API
  const handleOnConfirmAddPayment = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Purchase/payment/${id}`,
        {
          amount: Amount,
          store: decodedToken.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchPurchaseData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseAddAmountConfirmationDialog();
        handleCloseAddPaymentConfirmationDialog();
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
        import.meta.env.VITE_APP_URL_BASE + `/Purchase/deposit/${id}`,
        {
          store: decodedToken.id,
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
        refetchPurchaseData();
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
        console.error("Error updating deposit purchase: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating deposit purchase");
      }
    }
  };

  //make it credited API
  const handleOnConfirmCredited = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Purchase/credit/${id}`,
        {
          store: decodedToken.id,
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
        refetchPurchaseData();
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

  //fetch data
  const fetchSousPurchaseData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/SousPurchase/all/${id}/${
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
        throw new Error("Error receiving sous purchase data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: SousPurchaseData,
    error: SousPurchaseDataError,
    isLoading: SousPurchaseDataLoading,
    refetch: refetchSousPurchaseData,
  } = useQuery({
    queryKey: ["SousPurchaseData", user?.token, location.key, id],
    queryFn: fetchSousPurchaseData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });
  //update receipt status API
  const handleUpdateSousPurchase = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/SousPurchase/create/${decodedToken.id}`,
        {
          clientSousStocks: productsListToUpdate,
          purchase: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchSousPurchaseData();
        refetchPurchaseData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseModifyPurchaseModal();
        handleCloseUpdateSousPurchaseConfirmDialogOpen();
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
        console.error("Error updating sous purchase: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating sous purchase");
      }
    }
  };

  if (PurchaseDataLoading || SousPurchaseDataLoading) {
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

  if (PurchaseDataError || SousPurchaseDataError) {
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
              {language === "ar" ? "المشتريات" : "Achats"}
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
              #{PurchaseData?._id}
            </span>
          </div>
          <div className="orderProfileButtons">
            {PurchaseData?.closed &&
              PurchaseData?.sousPurchases?.length > 1 && (
                <ButtonRetour
                  showIcon={true}
                  buttonSpan={
                    language === "ar" ? "تفاصيل الإرجاع" : "Détails retour"
                  }
                  onClick={handleOpenRetourPurchaseModal}
                  language={language}
                />
              )}
            <ButtonModify
              showIcon={true}
              buttonSpan={
                language === "ar" ? "تعديل الشراء" : "Modifier l'achat"
              }
              onClick={handleOpenModifyPurchaseModal}
              language={language}
            />
            <ButtonExportPDF
              filename={language === "ar" ? "ملف_الشراء" : "Achat"}
              customerName={PurchaseData?.fournisseur?.name}
              orderId={PurchaseData?._id}
              language={language}
              purchaseData={PurchaseData}
              sousPurchaseData={SousPurchaseData}
            />
            <ButtonAdd
              showIcon={false}
              buttonSpan={
                language === "ar" ? "سجل الدفعات" : "Historique paiements"
              }
              onClick={handleOpenModal}
              language={language}
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
            {language === "ar" ? "تفاصيل الشراء" : "Détails d'achat"}
          </h2>
          <PurchaseProfileDetails data={PurchaseData} language={language} />
        </div>
        <div
          className={`flex h-full flex-col md:flex-row ${
            language === "ar"
              ? "md:gap-x-6 gap-y-6"
              : "md:space-x-6 space-y-6 md:space-y-0"
          }`}
        >
          {/* Products Section - Full width on mobile, 65% on desktop */}
          <div
            className="customerClass paddingClass w-full md:w-[65%]"
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
              {language === "ar" ? "منتجات الشراء" : "Produits de l'achat"}
            </h2>
            {SousPurchaseData?.map((sousPurchase) => (
              <PurchaseProfileDevicesProductTable
                key={sousPurchase._id}
                PurchaseData={sousPurchase}
                discount={PurchaseData.discount}
                language={language}
              />
            ))}
          </div>

          {/* Supplier Section - Full width on mobile, 40% on desktop */}
          <div
            className="w-full h-fit md:w-[40%] flex flex-col space-y-[32px]"
            style={{
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <div className="customerClass paddingClass">
              <h2
                className="customerClassTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المورد" : "Fournisseur"}
              </h2>

              {/* Phone Number */}
              <div className="flex flex-col space-y-1">
                <span
                  className="dashboardLatestOrdersDetails"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "رقم الهاتف" : "Numéro du téléphone"}
                </span>
                <div
                  className={`flex items-center ${
                    language === "ar" ? "gap-x-2" : "space-x-2"
                  }`}
                >
                  <PhoneIcon className="iconAsideBar text-[#888888]" />
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {PurchaseData.fournisseur?.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col space-y-1">
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
                <div className="flex flex-col space-y-1">
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {PurchaseData.fournisseur?.address}
                  </p>
                  <p
                    className="orderProfileSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {PurchaseData.fournisseur?.commune} -{" "}
                    {PurchaseData.fournisseur?.wilaya}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel={
          language === "ar" ? "سجل الدفعات" : "Historique paiements"
        }
        className="addNewModal PaymentHistory"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        <div className="customerClass">
          {/* Header Section - Responsive */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full space-y-4 md:space-y-0">
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
            {PurchaseData.closed == false ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
                {/* Deposit Button */}
                {PurchaseData.deposit == false ? (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "تعيين كعربون" : "Définir acompte"
                    }
                    onClick={handleOpenDepositConfirmationDialog}
                    language={language}
                  />
                ) : (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "إلغاء العربون" : "Annuler acompte"
                    }
                    onClick={handleOpenUnDepositConfirmationDialog}
                    language={language}
                  />
                )}

                {/* Credit Button */}
                {PurchaseData.credit == false ? (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "تعيين كآجل" : "Définir crédit"
                    }
                    onClick={handleOpenCreditedConfirmationDialog}
                    language={language}
                  />
                ) : (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "إلغاء الآجل" : "Annuler crédit"
                    }
                    color="red"
                    onClick={handleOpenUnCreditedConfirmationDialog}
                    language={language}
                  />
                )}

                {/* Payment Button */}
                {PurchaseData.credit == true ? (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "إضافة دفعة" : "Ajouter paiement"
                    }
                    onClick={handleOpenAddPaymentDialog}
                    language={language}
                  />
                ) : (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan={
                      language === "ar" ? "دفع كامل" : "Paiement total"
                    }
                    onClick={handleOpenFullyPaidDialog}
                    language={language}
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
              data={PurchaseData.payment}
              isClosed={!PurchaseData.closed}
              user={user}
              decodedToken={decodedToken}
              id={id}
              refetchPurchaseData={refetchPurchaseData}
              language={language}
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
              {language === "ar" ? "المجموع:" : "Total:"}{" "}
              <span className="font-bold">{PurchaseData.totalAmount} DA</span>
            </h2>
            <h2
              className="customerClassTitle text-center"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المتبقي:" : "Reste à payer:"}{" "}
              <span className="font-bold text-red-600">
                {PurchaseData.totalAmount -
                  (PurchaseData.payment?.reduce(
                    (sum, pay) => sum + pay.amount,
                    0
                  ) || 0)}{" "}
                DA
              </span>
            </h2>
          </div>

          {/* Close Button - Centered on mobile, positioned on desktop */}
          <button
            onClick={handleCloseModal}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 md:absolute md:bottom-0 md:right-0 
                 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200
                 w-full sm:w-auto md:w-auto md:bg-transparent md:hover:bg-transparent md:px-0 md:py-0 md:rounded-none"
          >
            {language === "ar" ? "إغلاق" : "Fermer"}
          </button>
        </div>
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        isOpen={isAddPaymentConfirmDialogOpen}
        onRequestClose={handleCloseAddPaymentConfirmationDialog}
        contentLabel={language === "ar" ? "إضافة دفعة" : "Ajouter paiement"}
        className="addNewModal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        <div className="customerClass p-0">
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "إضافة دفعة" : "Ajouter paiement"}
          </h2>
          <div className="dialogAddCustomerItem items-center">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "مبلغ الدفعة:" : "Montant:"}
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
        <div className="flex justify-end space-x-8 items-start mt-[20px]">
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseAddPaymentConfirmationDialog}
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

      {/* Modify Purchase Modal */}
      <Modal
        isOpen={modifyPurchaseModal}
        onRequestClose={handleCloseModifyPurchaseModal}
        contentLabel={
          language === "ar" ? "إضافة مرتجعات" : "Ajouter des retours"
        }
        className="addNewModal addNewStockModal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        <div className="customerClass">
          <AddPurchaseRetunsTableDetails
            productsListToUpdate={productsListToUpdate}
            setProductsListToUpdate={setProductsListToUpdate}
            language={language}
          />
          <div className="mt-[16px]">
            <div className="flex justify-end space-x-8">
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleCloseModifyPurchaseModal}
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
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={handleOpenUpdateSousPurchaseConfirmDialogOpen}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={isFullyPaidConfirmationOpen}
        onConfirm={handleOnConfirmFullyPaid}
        onClose={handleCloseFullyPaidConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد الدفع الكامل" : "Confirmer paiement total"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تأكيد الدفع الكامل؟"
            : "Êtes-vous sûr de vouloir confirmer le paiement total ?"
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isAddAmountConfirmDialogOpen}
        onConfirm={handleOnConfirmAddPayment}
        onClose={handleCloseAddAmountConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد إضافة الدفعة" : "Confirmer ajout paiement"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(true)}
        onClose={handleCloseCreditedConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد إضافة الدفعة" : "Confirmer credit"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isUnCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(false)}
        onClose={handleCloseUnCreditedConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد إضافة الدفعة" : "Confirmer uncredit"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(true)}
        onClose={handleCloseDepositConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد إضافة الدفعة" : "Confirmer deposit"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isUnDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(false)}
        onClose={handleCloseUnDepositConfirmationDialog}
        dialogTitle={
          language === "ar" ? "تأكيد إضافة الدفعة" : "Confirmer undeposit"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إضافة هذا المبلغ: ${Amount}؟`
            : `Êtes-vous sûr de vouloir ajouter ce montant : ${Amount} ?`
        }
        isloading={submitionLoading}
        language={language}
      />

      <ConfirmDialog
        open={isUpdateSousPurchaseConfirmDialogOpen}
        onConfirm={handleUpdateSousPurchase}
        onClose={handleCloseUpdateSousPurchaseConfirmDialogOpen}
        dialogTitle={
          language === "ar"
            ? "تأكيد تعديل الفاتورة"
            : "Confirmer la modification du achat"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تعديل هذه الفاتورة؟"
            : "Êtes-vous sûr de vouloir modifier cette achat ?"
        }
        isloading={submitionLoading}
      />

      {/* Other ConfirmDialogs would follow the same pattern */}

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
