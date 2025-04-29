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

  //update receipt status API
  const handleUpdateSousPurchase = async (val) => {
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

  if (PurchaseDataLoading) {
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

  if (PurchaseDataError) {
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
              language={language}
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
        <div className="customerClass paddingClass">
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
          className={`flex h-full ${
            language === "ar" ? "gap-x-6" : "space-x-6"
          }`}
        >
          {" "}
          <div className="customerClass paddingClass w-[65%]">
            <h2
              className="customerClassTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "منتجات الشراء" : "Produits de l'achat"}
            </h2>
            {PurchaseData?.sousPurchases?.map((sousPurchase) => (
              <PurchaseProfileDevicesProductTable
                key={sousPurchase._id}
                PurchaseData={sousPurchase}
                discount={PurchaseData.discount}
                language={language}
              />
            ))}
          </div>
          <div className="w-[40%] flex-col space-y-[32px]">
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
          <div className="flex flex-row justify-between items-center w-full">
            <h2
              className="customerClassTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "سجل الدفعات" : "Historique des paiements"}
            </h2>
            {PurchaseData.closed == false ? (
              <div className="flex space-x-4">
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
                className="customerClassTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "مدفوع بالكامل" : "Payé en totalité"}
              </h2>
            )}
          </div>
          <div className="scrollProductHistorique">
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
        <div className="flex justify-end mt-4">
          <div className="flex flex-row justify-center items-center w-full">
            <h2
              className="customerClassTitle"
              style={{
                marginInlineEnd: "2%",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المجموع:" : "Total:"}{" "}
              {PurchaseData.totalAmount} DA
            </h2>
            <h2
              className="customerClassTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المتبقي:" : "Reste à payer:"}{" "}
              {PurchaseData.totalAmount -
                (PurchaseData.payment?.reduce(
                  (sum, pay) => sum + pay.amount,
                  0
                ) || 0)}{" "}
              DA
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            style={{
              marginTop: "20px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 absolute bottom-5 right-8"
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
