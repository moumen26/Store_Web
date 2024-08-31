import React, { useState } from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import AddOrderProfileDetails from "../components/AddOrderProfileDetails";
import AddOrderTableDetails from "../components/AddOrderTableDetails";
import ButtonAdd from "../components/ButtonAdd";
import AddOrderSubTotal from "../components/AddOrderSubTotal";
import axios from "axios";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AddOrder() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [APIOrderType, setAPIOrderType] = useState(null);
  const [APIDeliveryDate, setAPIDeliveryDate] = useState(null);
  const [DeliveredLocation, setDeliveredLocation] = useState(null);
  const [Products, setProducts] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleNavigateClick = (path) => {
    navigate(path);
  };

  const handleCalculateTotals = (subtotal, deliveryAmount, total) => {
    setSubtotal(subtotal);
    setDeliveryAmount(deliveryAmount);
    setTotal(total);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmitCreateOrder = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/Receipt/store/${decodedToken.id}`, 
        {
          client: id,
          products: Products,
          type: APIOrderType,
          total: subtotal,
          deliveredAmount: deliveryAmount,
          deliveredExpectedDate: APIDeliveryDate,
          deliveredLocation: DeliveredLocation,
        },
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            }
        }
      );
      if (response.status === 200) {
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialog();
        handleNavigateClick(-1);
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
          console.error("Error creating new order: No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error creating new order");
        }
    }
  }

  return (
    <div className="pagesContainer addOrder">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Add a new order</h2>
        <div className="flex items-center space-x-2">
          <ButtonCancel />
          <ButtonSave setOnClick={handleOpenConfirmationDialog}/>
        </div>
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Basic Information</h2>
        <AddOrderProfileDetails
          deliveryAmount={deliveryAmount}
          setDeliveryAmount={setDeliveryAmount}
          setAPIOrderType={setAPIOrderType}
          setAPIDeliveryDate={setAPIDeliveryDate}
          setAPIDeliveryAddress={setDeliveredLocation}
        />
      </div>
      <div className="pageTable">
        <div className="flex items-center justify-between">
          <h2 className="customerClassTitle">Order Details</h2>
          <ButtonAdd buttonSpan="Add item" onClick={handleOpenModal} />
        </div>
        <div className="pageTableContainer">
          <AddOrderTableDetails
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            onCalculateTotals={handleCalculateTotals}
            deliveryAmount={deliveryAmount}
            setAPIProducts={setProducts}
          />
        </div>
        <div className="w-full flex justify-end">
          <AddOrderSubTotal
            subtotal={subtotal}
            deliveryAmount={deliveryAmount}
            total={total}
          />
        </div>
      </div>
      <ConfirmDialog
        open={openConfirmationDialog}
        onConfirm={handleSubmitCreateOrder}
        onClose={handleCloseDialog}
        dialogTitle="Confirm order submition"
        dialogContentText={`Are you sure you want to submit this order?`}
      />
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity= {alertType ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
