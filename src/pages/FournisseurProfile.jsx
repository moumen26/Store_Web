import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
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

export default function FournisseurProfile({ onToggle, isCollapsed }) {
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
    <div className="pagesContainer">
      <div className="flexHeader">
        <div
          onClick={onToggle}
          className="w-fit h-fit p-1 flex justify-center items-center border border-[#c9e4ee] rounded-[4px] cursor-pointer"
        >
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header />
      </div>{" "}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Fournisseur</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>#{OneFournisseurData?._id}</span>
        </div>
        <div className="flex space-x-2">
          <ButtonLight
            buttonSpan="Add payement"
            onClick={handleOpenAddPayementModal}
          />
          <ButtonAdd
            buttonSpan="Create Achat"
            showIcon={false}
            onClick={handleCreateOrder}
          />

          <Modal
            isOpen={addPayementModal}
            onRequestClose={handleCloseAddPaymentDialog}
            contentLabel="Add new Payement"
            className="addNewModal"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
            }}
          >
            <div className="customerClass p-0">
              <h2 className="customerClassTitle">Add New Payement</h2>
              <div className="dialogAddCustomerItem">
                <span>Amount :</span>
                <div className="inputForm">
                  <input
                    type="number"
                    min={0}
                    name="addPayement"
                    onChange={handlePaymentAmountChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-8 items-start mt-[20px]">
                {!submitionLoading ? (
                  <>
                    <button
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={handleCloseAddPaymentDialog}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={handleConfirmAddPayment}
                    >
                      Save
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
        <h2 className="customerClassTitle">Personal Information</h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span className="personalInformationSpan">First Name</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Last Name</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Number Phone</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.phoneNumber}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Wilaya</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Commune</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.commune}
            </h3>
          </div>
          {OneFournisseurData?.address && (
            <div className="flex-col">
              <span className="personalInformationSpan">Address</span>
              <h3 className="personalInformationDetails">
                {OneFournisseurData?.address}
              </h3>
            </div>
          )}
        </div>
      </div>
      <>
        <div className="customerClass paddingClass">
          <h2 className="customerClassTitle">Stats</h2>
          <div className="flex space-x-4">
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Purchases"
              customerStatsCardDetails={AchatStatisticsData?.count}
            />
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Amount"
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalAmount
              )}
            />

            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Paid"
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalPayment
              )}
            />

            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Unpaid"
              customerStatsCardDetails={`- ${formatNumber(
                AchatStatisticsData?.totalCreditUnpaid
              )}`}
            />
          </div>
        </div>
        <div className="customerClass justify-start paddingClass customerOrdersClass">
          <div className="flex justify-between items-center">
            <h2 className="customerClassTitle">Achats</h2>
            <Search
              placeholder="Search by Achat..."
              onChange={handleSearchChange}
            />
          </div>
          <FournisseurProfileAchatsTable
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
