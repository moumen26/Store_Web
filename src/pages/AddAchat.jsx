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

export default function AddAchat({ onToggle, toggleLanguage, language }) {
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
        <div
          className="pagesContainer addOrder"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <div className="flexHeader">
            <div onClick={onToggle} className="equalsIcon">
              <EqualsIcon className="iconAsideBarClose" />
            </div>
            <Header toggleLanguage={toggleLanguage} language={language} />
          </div>
          <div className="titlePageButton">
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="pagesTitle"
            >
              {language === "ar"
                ? "إضافة شراء جديد"
                : "Ajouter un nouvel achat"}
            </h2>
            <div
              className={`buttonTop flex items-center space-x-2 ${
                language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <ButtonCancel language={language} />
              <ButtonSave
                setOnClick={handleOpenConfirmationDialog}
                language={language}
              />
            </div>
          </div>
          <div className="customerClass paddingClass">
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="customerClassTitle"
            >
              {language === "ar" ? "معلومات أساسية" : "Informations de base"}
            </h2>
            <AddAchatProfileDetails
              language={language}
              fournisseurName={
                fournisseurData?.firstName + " " + fournisseurData?.lastName
              }
              PhoneNumber={fournisseurData?.phoneNumber}
            />
          </div>
          <div
            className="pageTable"
            style={{
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <div className="titlePageButton">
              <h2
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="customerClassTitle"
              >
                {language === "ar" ? "تفاصيل الشراء" : "Détails d'achat"}
              </h2>
              <div
                className={`buttonTop flex items-center space-x-2 ${
                  language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                }`}
              >
                <ButtonAdd
                  language={language}
                  buttonSpan={
                    language === "ar" ? "إضافة تخفيض" : "Ajouter une remise"
                  }
                  onClick={handleRemiseOpenModal}
                />
                <ButtonAdd
                  language={language}
                  buttonSpan={
                    language === "ar" ? "إضافة عنصر" : "Ajouter un élément"
                  }
                  onClick={handleOpenModal}
                />
              </div>
            </div>
            <div className="pageTableContainer">
              <AddAchatTableDetails
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                onCalculateTotals={handleCalculateTotals}
                deliveryAmount={deliveryAmount}
                language={language}
                setAPIProducts={setProducts}
              />
            </div>
            <div className="w-full flex justify-end">
              <AddAchatSubTotal
                total={total}
                discount={discount}
                language={language}
              />
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
        contentLabel={language === "ar" ? "إضافة تخفيض" : "Ajouter une remise"}
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
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="customerClassTitle"
          >
            {language === "ar" ? "إضافة تخفيض" : "Ajouter une remise"}
          </h2>
          <div className="mt-[16px]">
            <form>
              <div className="flex-col space-y-8">
                <div className="dialogAddCustomerItem items-center">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar"
                      ? "قيمة التخفيض :"
                      : "Valeur de la remise :"}
                  </span>
                  <div className="inputForm relative">
                    <input
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      type="text"
                      name="remise"
                      className={`${language === "ar" ? "pl-10" : "pr-10"}`}
                      onChange={handleDiscountChange}
                      placeholder={
                        language === "ar"
                          ? "أدخل قيمة التخفيض (0-100)"
                          : "Saisissez la remise"
                      }
                    />
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className={`absolute top-1/2 transform -translate-y-1/2 ${
                        language === "ar" ? "left-3" : "right-3"
                      }`}
                    >
                      {language === "ar" ? "دج" : "DA"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`flex justify-end mt-2 ${
                  language === "ar" ? "gap-x-8" : "space-x-8"
                }`}
              >
                {" "}
                <button
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleRemiseCloseModal}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <input
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  type="button"
                  value={language === "ar" ? "حفظ" : "Enregistrer"}
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
        language={language}
        onClose={handleCloseDialog}
        dialogTitle={
          language === "ar" ? "تأكيد عملية الشراء" : "Confirmation d'achat"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد إرسال عملية الشراء هذه؟"
            : "Êtes-vous sûr de vouloir soumettre cet achat ?"
        }
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
