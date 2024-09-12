import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
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
import axios from "axios";
import { is } from "date-fns/locale";
import ConfirmDialog from "../components/ConfirmDialog";
import { Alert, Snackbar } from "@mui/material";

export default function PurchaseProfile() {
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

  const [isAddAmountConfirmDialogOpen, setIsAddAmountConfirmDialogOpen] = useState(false);
  const handleOpenAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(true);
  };
  const handleCloseAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(false);
    setAmount(0);
  };

  const [isFullyPaidConfirmationOpen, setisFullyPaidConfirmationOpen] = useState(false);
  const handleOpenFullyPaidDialog = () => {
    setisFullyPaidConfirmationOpen(true);
  };
  const handleCloseFullyPaidConfirmationDialog = () => {
    setisFullyPaidConfirmationOpen(false);
  };

  const [isAddPaymentConfirmDialogOpen, setisAddPaymentConfirmDialogOpen] = useState(false);
  const handleOpenAddPaymentDialog = () => {
    setisAddPaymentConfirmDialogOpen(true);
  };
  const handleCloseAddPaymentConfirmationDialog = () => {
    setisAddPaymentConfirmDialogOpen(false);
  };
  

  const [isDepositConfirmDialogOpen, setisDepositConfirmDialogOpen] = useState(false);
  const handleOpenDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(true);
  };
  const handleCloseDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(false);
  };

  const [isUnDepositConfirmDialogOpen, setisUnDepositConfirmDialogOpen] = useState(false);
  const handleOpenUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(true);
  };
  const handleCloseUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(false);
  };
  
  const [isCreditedConfirmDialogOpen, setisCreditedConfirmDialogOpen] = useState(false);
  const handleOpenCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(true);
  };
  const handleCloseCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(false);
  };

  const [isUnCreditedConfirmDialogOpen, setisUnCreditedConfirmDialogOpen] = useState(false);
  const handleOpenUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(true);
  };
  const handleCloseUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(false);
  };

    //---------------------------------API calls---------------------------------\\

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
      const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/Purchase/full/payment/${id}`, 
        {
          store: decodedToken.id,
        },
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            }
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
  }

  //add payment API
  const handleOnConfirmAddPayment = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/Purchase/payment/${id}`, 
        {
          amount: Amount,
          store: decodedToken.id,
        },
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            }
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
  }

  //add payment API
  const handleOnDepositConfirm = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/Purchase/deposit/${id}`,
        {
          store: decodedToken.id,
          deposit: val,
        },
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            }
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
  }

  //make it credited API
  const handleOnConfirmCredited = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/Purchase/credit/${id}`,
        {
          store: decodedToken.id,
          credited: val,
        },
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            }
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
  }

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
    <div className="pagesContainer">
      <Header />
      <div id="exportable-content" className="space-y-[32px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span>Purchases</span>
            <ChevronRightIcon className="iconAsideBar" />
          </div>
          <div className="orderProfileButtons">
            <ButtonExportPDF filename="Purchase_Profile" />
            <ButtonAdd
              showIcon={false}
              buttonSpan="View Payment History"
              onClick={handleOpenModal}
            />
          </div>
        </div>
        <div className="customerClass">
          <h2 className="customerClassTitle">Purchase Details</h2>
          <PurchaseProfileDetails data={PurchaseData}/>
        </div>
        <div className="flex space-x-6 h-full">
          <div className="customerClass w-[60%]">
            <h2 className="customerClassTitle">Devices in the Purchase</h2>
            <PurchaseProfileDevicesProductTable PurchaseData={PurchaseData}/>
          </div>
          <div className="w-[40%] flex-col space-y-[32px]">
            <div className="customerClass">
              <h2 className="customerClassTitle">Fournisseur</h2>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Contact Information
                </span>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="iconAsideBar text-[#888888]" />
                  <p className="orderProfileSpan">{PurchaseData.fournisseur.phoneNumber}</p>
                </div>
              </div>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Default Address
                </span>
                <div className="flex-col space-y-1">
                  <p className="orderProfileSpan">{PurchaseData.fournisseur.address}</p>
                  <p className="orderProfileSpan">{PurchaseData.fournisseur.commune} - {PurchaseData.fournisseur.wilaya}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Payment History"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "60%",
            margin: "auto",
            height: "fit-content",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="customerClassTitle">Payment History</h2>
            {PurchaseData.closed == false ? (
              <>
                {(PurchaseData.deposit == false) ? (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it deposit"
                    onClick={handleOpenDepositConfirmationDialog}
                  />
                ):(
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it undeposit"
                    onClick={handleOpenUnDepositConfirmationDialog}
                  />
                )}
                {PurchaseData.credit == false ? (
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it credited"
                    onClick={handleOpenCreditedConfirmationDialog}
                  />
                ):(
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it uncredited"
                    onClick={handleOpenUnCreditedConfirmationDialog}
                  />
                )}
                {PurchaseData.credit == true ?
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Add payment"
                    onClick={handleOpenAddPaymentDialog}
                  />
                  :
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="full payment"
                    onClick={handleOpenFullyPaidDialog}
                  />
                }
              </>
            ) : (
              <h2 className="customerClassTitle">{`Fully paid`}</h2>
            )}
          </div>
          <div className="scrollProductHistorique">
            <PaymentHistorique
              data={PurchaseData.payment}
              isClosed={!PurchaseData.closed}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-row justify-center items-center w-full">
            <h2
              className="customerClassTitle"
              style={{ marginInlineEnd: "2%" }}
            >
              Total : {PurchaseData.totalAmount} DA
            </h2>
            <h2 className="customerClassTitle">
              Rest to pay :{" "}
              {PurchaseData.totalAmount -
                PurchaseData.payment.reduce((sum, pay) => sum + pay.amount, 0)}
              DA
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            style={{ marginTop: "20px" }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 absolute bottom-5 right-8"
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isAddPaymentConfirmDialogOpen}
        onRequestClose={handleCloseAddPaymentConfirmationDialog}
        contentLabel="Add payment"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "60%",
            margin: "auto",
            height: "52%",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass">
          <h2 className="customerClassTitle">Add payment</h2>
          <div className="dialogAddCustomerItem items-center">
            <span>Payment Amount :</span>
            <div className="inputForm">
              <input
                type="number"
                name="amount"
                min={0}
                onChange={handleAmountChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-8 items-start absolute bottom-5 right-8">
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseAddPaymentConfirmationDialog}
          >
            Cancel
          </button>
          <button
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={handleOpenAddAmountConfirmationDialog}
          >
            Save
          </button>
        </div>
      </Modal>
      <ConfirmDialog
        open={isFullyPaidConfirmationOpen}
        onConfirm={handleOnConfirmFullyPaid}
        onClose={handleCloseFullyPaidConfirmationDialog}
        dialogTitle="Confirm full payment"
        dialogContentText={`Are you sure you want to confirm the full payment?`}
        isloading={submitionLoading}
      />
      <ConfirmDialog
        open={isAddAmountConfirmDialogOpen}
        onConfirm={handleOnConfirmAddPayment}
        onClose={handleCloseAddAmountConfirmationDialog}
        dialogTitle="Confirm add payment"
        dialogContentText={`Are you sure you want to add this amount: ${Amount}?`}
        isloading={submitionLoading}
      />
      <ConfirmDialog
        open={isDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(true)}
        onClose={handleCloseDepositConfirmationDialog}
        dialogTitle="Confirm make it deposit sell"
        dialogContentText={`Are you sure you want to confirm to make deposit sell`}
        isloading={submitionLoading}
      />
      <ConfirmDialog
        open={isUnDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(false)}
        onClose={handleCloseUnDepositConfirmationDialog}
        dialogTitle="Confirm make it undeposit sell"
        dialogContentText={`Are you sure you want to confirm to make undeposit sell`}
        isloading={submitionLoading}
      />
      <ConfirmDialog
        open={isCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(true)}
        onClose={handleCloseCreditedConfirmationDialog}
        dialogTitle="Confirm make it credited"
        dialogContentText={`Are you sure you want to confirm to make it credited?`}
        isloading={submitionLoading}
      />
      <ConfirmDialog
        open={isUnCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(false)}
        onClose={handleCloseUnCreditedConfirmationDialog}
        dialogTitle="Confirm make it uncredited"
        dialogContentText={`Are you sure you want to confirm to make it uncredited?`}
        isloading={submitionLoading}
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
