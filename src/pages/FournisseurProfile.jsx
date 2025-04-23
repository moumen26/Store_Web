import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerStatsCard from "../components/CustomerStatsCard";
import Search from "../components/Search";
import FournisseurProfileAchatsTable from "../components/FournisseurProfileAchatsTable";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import Modal from "react-modal";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonLight from "../components/ButtonLight";
import { formatNumber } from "../util/useFullFunctions";
import axios from "axios";

export default function FournisseurProfile({
  onToggle,
  toggleLanguage,
  language,
}) {
  const { id } = useParams();
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [PaymentAmount, setPaymentAmount] = useState(0);
  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const [addPayementModal, setAddPayementModal] = useState(false);

  const handleOpenAddPayementModal = () => {
    setAddPayementModal(true);
  };

  const handleCloseAddPaymentDialog = () => {
    setAddPayementModal(false);
  };

  //---------------------------------API calls---------------------------------\\

  // fetching OneFournisseur data
  const fetchOneFournisseurData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Fournisseur/one/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: OneFournisseurData,
    error: OneFournisseurError,
    isLoading: OneFournisseurLoading,
    refetch: OneFournisseurRefetch,
  } = useQuery({
    queryKey: ["OneFournisseurData", user?.token, location.key],
    queryFn: fetchOneFournisseurData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Achat Data By Fournisseur data
  const fetchAchatDataByFournisseur = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/all/${decodedToken.id}/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: AchatDataByFournisseur,
    error: AchatDataByFournisseurError,
    isLoading: AchatDataByFournisseurLoading,
    refetch: AchatDataByFournisseurRefetch,
  } = useQuery({
    queryKey: ["AchatDataByFournisseur", user?.token, location.key],
    queryFn: fetchAchatDataByFournisseur,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching statistics data
  const fetchAchatStatisticsData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/statistics/${decodedToken.id}/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: AchatStatisticsData,
    error: AchatStatisticsDataError,
    isLoading: AchatStatisticsDataLoading,
    refetch: AchatStatisticsDataRefetch,
  } = useQuery({
    queryKey: ["AchatStatisticsData", user?.token, location.key],
    queryFn: fetchAchatStatisticsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  const handleConfirmAddPayment = async () => {
    //API call to make the user a vendor
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Purchase/process/payments/${decodedToken.id}`,
        {
          amount: PaymentAmount,
          fournisseurId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        AchatStatisticsDataRefetch();
        AchatDataByFournisseurRefetch();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseAddPaymentDialog();
      } else {
        setAlertType(true);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType(true);
        setSnackbarMessage(error.response.data.message);
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

  const handleCreateOrder = () => {
    navigate(`/AddAchat/${id}`, { state: OneFournisseurData });
  };

  if (OneFournisseurLoading) {
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
      </div>{" "}
      <div className="customerTop">
        <div className="flex items-center space-x-1">
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الموردين" : "Fournisseurs"}
          </span>

          {language === "ar" ? (
            <ChevronLeftIcon className="iconAsideBar" />
          ) : (
            <ChevronRightIcon className="iconAsideBar" />
          )}

          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            #{OneFournisseurData?._id}
          </span>
        </div>
        <div
          className={`flex items-center space-x-2 ${
            language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
          }`}
        >
          {" "}
          <ButtonLight
            language={language}
            buttonSpan={language === "ar" ? "إضافة دفع" : "Add payment"}
            onClick={handleOpenAddPayementModal}
          />
          <ButtonAdd
            buttonSpan={language === "ar" ? "إنشاء عملية شراء" : "Create Achat"}
            showIcon={false}
            language={language}
            onClick={handleCreateOrder}
          />
          <Modal
            isOpen={addPayementModal}
            onRequestClose={handleCloseAddPaymentDialog}
            contentLabel={
              language === "ar"
                ? "إضافة دفعة جديدة"
                : "Ajouter un nouveau paiement"
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
              className="customerClass pb-0"
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
            >
              <h2
                className="customerClassTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "إضافة دفعة جديدة"
                  : "Ajouter un nouveau paiement"}
              </h2>
              <div className="dialogAddCustomerItem">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "المبلغ :" : "Montant :"}
                </span>
                <div className="inputForm">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="number"
                    min={0}
                    name="addPayement"
                    onChange={handlePaymentAmountChange}
                  />
                </div>
              </div>

              <div
                className={`flex justify-end ${
                  language === "ar" ? "gap-x-4" : "space-x-4"
                }`}
              >
                {" "}
                {!submitionLoading ? (
                  <>
                    <button
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={handleCloseAddPaymentDialog}
                    >
                      {language === "ar" ? "إلغاء" : "Annuler"}
                    </button>
                    <button
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={handleConfirmAddPayment}
                    >
                      {language === "ar" ? "حفظ" : "Enregistrer"}
                    </button>
                  </>
                ) : (
                  <div className="flex justify-end space-x-8 pr-8 items-start h-[60px] mt-2">
                    <CircularProgress color="inherit" />
                  </div>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="customerClass paddingClass">
        <h2
          className="customerClassTitle"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar"
            ? "المعلومات الشخصية"
            : "Informations personnelles"}
        </h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "الاسم" : "Prénom"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "اللقب" : "Nom"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.phoneNumber}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "الولاية" : "Wilaya"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "البلدية" : "Commune"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.commune}
            </h3>
          </div>
          {OneFournisseurData?.address && (
            <div className="flex-col">
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="personalInformationSpan"
              >
                {language === "ar" ? "العنوان" : "Adresse"}
              </span>
              <h3
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="personalInformationDetails"
              >
                {OneFournisseurData?.address}
              </h3>
            </div>
          )}
        </div>
      </div>
      <>
        <div className="customerClass paddingClass Stats">
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="customerClassTitle"
          >
            {language === "ar" ? "الإحصائيات" : "Statistiques"}
          </h2>
          <div className="flexCard fournisseurFlexCard">
            {" "}
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المشتريات" : "Total des achats"
              }
              customerStatsCardDetails={AchatStatisticsData?.count}
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المبلغ" : "Montant total"
              }
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalAmount
              )}
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المدفوع" : "Total payé"
              }
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalPayment
              )}
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي غير المدفوع" : "Total impayé"
              }
              customerStatsCardDetails={`- ${formatNumber(
                AchatStatisticsData?.totalCreditUnpaid
              )}`}
            />
          </div>
        </div>
        <div className="customerClass justify-start paddingClass customerOrdersClass">
          <div className="flex justify-between items-center">
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="customerClassTitle"
            >
              {language === "ar" ? "المشتريات" : "Achats"}
            </h2>
            <Search
              placeholder={
                language === "ar"
                  ? "البحث عن طريق الشراء..."
                  : "Rechercher par l'achat..."
              }
              onChange={handleSearchChange}
              language={language}
            />
          </div>
          <FournisseurProfileAchatsTable
            language={language}
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            data={AchatDataByFournisseur}
            loading={AchatDataByFournisseurLoading}
          />
          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={alertType ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </>
    </div>
  );
}
