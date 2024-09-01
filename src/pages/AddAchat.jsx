import React, { useState } from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import ButtonAdd from "../components/ButtonAdd";
import AddAchatProfileDetails from "../components/AddAchatProfileDetails";
import AddAchatTableDetails from "../components/AddAchatTableDetails";
import AddAchatSubTotal from "../components/AddAchatSubTotal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Alert, CircularProgress, Snackbar } from "@mui/material";

export default function AddAchat() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const navigate = useNavigate();

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Products, setProducts] = useState([]);
  const [OpenConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };

  const handleCalculateTotals = (subtotal, deliveryAmount, total) => {
    setSubtotal(subtotal);
    setDeliveryAmount(deliveryAmount);
    setTotal(total);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
  }

  const handleNavigateClick = (path) => {
    navigate(path);
  };

  //---------------------------------API calls---------------------------------\\

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmitCreateAchat = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/Purchase/create/${decodedToken.id}`, 
        {
          fournisseur: id,
          products: Products,
          amount: subtotal,
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
          console.error("Error creating new achat: No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error creating new achat");
        }
    }
    setProducts([]);
  }
  return (
    <>
      {!submitionLoading ?
        <div className="pagesContainer addOrder">
          <Header />
          <div className="w-full flex items-center justify-between">
            <h2 className="pagesTitle">Add a new achat</h2>
            <div className="flex items-center space-x-2">
              <ButtonCancel />
              <ButtonSave setOnClick={handleOpenConfirmationDialog}/>
            </div>
          </div>
          <div className="customerClass">
            <h2 className="customerClassTitle">Basic Information</h2>
            <AddAchatProfileDetails />
          </div>
          <div className="pageTable">
            <div className="flex items-center justify-between">
              <h2 className="customerClassTitle">Achat Details</h2>
              <ButtonAdd buttonSpan="Add item" onClick={handleOpenModal} />
            </div>
            <div className="pageTableContainer">
              <AddAchatTableDetails
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                onCalculateTotals={handleCalculateTotals}
                deliveryAmount={deliveryAmount}
                setAPIProducts={setProducts}
              />
            </div>
            <div className="w-full flex justify-end">
              <AddAchatSubTotal total={total} />
            </div>
          </div>
          {/* ConfirmDialog */}
          <ConfirmDialog
            open={OpenConfirmationDialog}
            onConfirm={handleSubmitCreateAchat}
            onClose={handleCloseDialog}
            dialogTitle="Confirm achat submition"
            dialogContentText={`Are you sure you want to submit this achat?`}
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
      :
        <div className="flex items-center justify-center h-screen">
          <CircularProgress />
        </div>
    }
    </>
  );
}
