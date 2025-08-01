import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import DashboardCalendar from "../components/DashboardCalendar";
import OrderCard from "../components/OrderCard";
import LossesTable from "../components/LossesTable";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useLocation } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { formatNumber } from "../util/useFullFunctions";

// Ensure you set the root element for accessibility
Modal.setAppElement("#root");

export default function Losses({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  const [price, setPrice] = useState("");
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const [reason, setReason] = useState("");
  const handleChangeReason = (e) => {
    setReason(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      // Update dashboard content based on the selected date range
      updateDashboardContent(dateRange.startDate, dateRange.endDate);
    }
  }, [dateRange]);

  const updateDashboardContent = (startDate, endDate) => {
    // Logic to update dashboard content based on selected date range
    console.log("Selected range:", startDate, endDate);
    // Fetch or filter data based on date range and update dashboard content
  };

  const [openModelAddLoss, setOpenModelAddLoss] = useState(false);

  const handleOpenModalAddLoss = () => {
    setOpenModelAddLoss(true);
  };

  const handleCloseModalAddLoss = () => {
    setOpenModelAddLoss(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //fetch data
  const fetchLossesData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Losses/store/${decodedToken.id}`,
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
        throw new Error("Error receiving losses data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: LossesData,
    error: LossesDataError,
    isLoading: LossesDataLoading,
    refetch: refetchLossesData,
  } = useQuery({
    queryKey: ["LossesData", user?.token, location.key],
    queryFn: fetchLossesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //fetch statistics
  const fetchLossesstatistics = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Losses/store/statistics/${
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
        throw new Error("Error receiving losses statistics");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: Lossesstatistics,
    error: LossesstatisticsError,
    isLoading: LossesstatisticsLoading,
    refetch: refetchLossesstatistics,
  } = useQuery({
    queryKey: ["Lossesstatistics", user?.token, location.key],
    queryFn: fetchLossesstatistics,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  const refetchData = () => {
    refetchLossesData();
    refetchLossesstatistics();
  };

  const handleSubmitCreateLoss = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/Losses/store/create/${decodedToken.id}`,
        {
          price: price,
          reason: reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseModalAddLoss();
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
        console.error("Error creating new loss: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating new loss");
      }
    }
  };

  return (
    <div
      className="pagesContainer pageContainerCards"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>
        <div className="titlePageButton">
          <h2
            className="pagesTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الخسائر" : "Pertes"}
          </h2>
          <DashboardCalendar
            onDateChange={(start, end) =>
              setDateRange({ startDate: start, endDate: end })
            }
            language={language}
          />
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar">
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "إجمالي الخسائر" : "Total des pertes"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            Lossesstatistics?.count ? Lossesstatistics?.count : 0
          }
          loading={LossesstatisticsLoading}
        />
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "المبلغ الإجمالي" : "Montant total"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={`${formatNumber(
            Lossesstatistics?.total ? Lossesstatistics?.total : 0
          )} ${language === "ar" ? "دج" : "DA"}`}
          loading={LossesstatisticsLoading}
        />
      </div>
      <div
        className="pageTable ordersTable"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الخسارة..."
                : "Rechercher par perte..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            language={language}
          />
          <div
            className={`flex items-center ${
              language === "ar"
                ? "md:space-x-reverse md:space-x-2"
                : "md:space-x-2"
            }`}
          >s
            <ButtonExportExel
              data={filteredData}
              filename={language === "ar" ? "الخسائر" : "Pertes"}
              language={language}
            />
            <ButtonAdd
              buttonSpan={
                language === "ar" ? "إضافة خسارة" : "Ajouter une perte"
              }
              language={language}
              onClick={handleOpenModalAddLoss}
            />
            <Modal
              isOpen={openModelAddLoss}
              onRequestClose={handleCloseModalAddLoss}
              contentLabel={
                language === "ar"
                  ? "إضافة خسارة جديدة"
                  : "Ajouter une nouvelle perte"
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
                    ? "إضافة خسارة جديدة"
                    : "Ajouter une nouvelle perte"}
                </h2>
                <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
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
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="number"
                        min={0}
                        name="lossAmount"
                        onChange={handleChangePrice}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "السبب :" : "Cause :"}
                    </span>
                    <div className="inputForm">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="text"
                        name="lossCause"
                        onChange={handleChangeReason}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`flex justify-end ${
                    language === "ar" ? "gap-x-8" : "space-x-8"
                  }`}
                >
                  {!submitionLoading ? (
                    <>
                      <button
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={handleCloseModalAddLoss}
                      >
                        {language === "ar" ? "إلغاء" : "Annuler"}
                      </button>
                      <button
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={handleSubmitCreateLoss}
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
        <div className="pageTableContainer">
          <LossesTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            data={LossesData}
            loading={LossesDataLoading}
            refetchLossesData={refetchData}
            language={language}
          />
        </div>
      </div>
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
  );
}
