import React, { useState } from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import ButtonAdd from "../components/ButtonAdd";
import AddAchatProfileDetails from "../components/AddAchatProfileDetails";
import AddAchatTableDetails from "../components/AddAchatTableDetails";
import AddAchatSubTotal from "../components/AddAchatSubTotal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import Modal from "react-modal";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function AddAchat({ onToggle, isCollapsed }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fournisseurData = location.state || {};

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const handleDiscountChange = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    let numericValue = Number(value);
    if (numericValue > 100) numericValue = 100;

    e.target.value = numericValue;
    setDiscount(numericValue);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemiseModalOpen, setIsRemiseModalOpen] = useState(false);
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
    setQuantityPerBox(0);
    setQuantityPerUnity(0);
  };

  const handleRemiseOpenModal = () => {
    setIsRemiseModalOpen(true);
  };

  const handleRemiseCloseModal = () => {
    setDiscount(0);
    setIsRemiseModalOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
  };

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
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/Purchase/create/${decodedToken.id}`,
        {
          fournisseur: id,
          products: Products,
          amount: subtotal,
          Discount: Number(discount) > 0 ? discount : 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
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
  };

  return (
    <>
      {!submitionLoading ? (
        <div className="pagesContainer addOrder">
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
            <h2 className="pagesTitle">Add a new achat</h2>
            <div className="flex items-center space-x-2">
              <ButtonCancel />
              <ButtonSave setOnClick={handleOpenConfirmationDialog} />
            </div>
          </div>
          <div className="customerClass paddingClass">
            <h2 className="customerClassTitle">Basic Information</h2>
            <AddAchatProfileDetails
              fournisseurName={
                fournisseurData?.firstName + " " + fournisseurData?.lastName
              }
              PhoneNumber={fournisseurData?.phoneNumber}
            />
          </div>
          <div className="pageTable">
            <div className="flex items-center justify-between">
              <h2 className="customerClassTitle">Achat Details</h2>
              <div className="flex space-x-2">
                <ButtonAdd
                  buttonSpan="Add Remise"
                  onClick={handleRemiseOpenModal}
                />
                <ButtonAdd buttonSpan="Add item" onClick={handleOpenModal} />
              </div>
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
              <AddAchatSubTotal total={total} discount={discount} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <CircularProgress color="inherit" />
        </div>
      )}

      <Modal
        isOpen={isRemiseModalOpen}
        onRequestClose={handleRemiseCloseModal}
        contentLabel="Add Remise"
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass p-0">
          <h2 className="customerClassTitle">Add Remise</h2>
          <div className="mt-[16px]">
            <form>
              <div className="flex-col space-y-8">
                <div className="dialogAddCustomerItem items-center">
                  <span>Remise Value :</span>
                  <div className="inputForm relative">
                    <input
                      type="text"
                      name="remise"
                      className="pr-10"
                      onChange={handleDiscountChange}
                      placeholder="Enter discount (0-100)"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-8 mt-[20px]">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleRemiseCloseModal}
                >
                  Cancel
                </button>
                <input
                  type="button"
                  value={"Save"}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    setIsRemiseModalOpen(false);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>

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
          severity={alertType ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
