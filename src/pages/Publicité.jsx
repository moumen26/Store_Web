import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import OrderCard from "../components/OrderCard";
import PubSwiperStore from "../components/PubSwiperStore";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { TokenDecoder } from "../util/DecodeToken";

const UploadIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// Ensure you set the root element for accessibility
Modal.setAppElement("#root");

export default function Publicité({ onToggle, toggleLanguage, language }) {
  const decodedToken = TokenDecoder();
  const { user } = useAuthContext();
  const location = useLocation();
  const [openModelAddPub, setOpenModelAddPub] = useState(false);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Distination, setDistination] = useState("");
  const [submittingPub, setSubmittingPub] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleDistinationChange = (e) => {
    setDistination(e.target.value);
    setSelectedDestination(e.target.value);
  };

  const handleOpenModalAddPub = () => {
    setOpenModelAddPub(true);
  };

  const handleCloseModalAddPub = () => {
    setOpenModelAddPub(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
    }
  };

  const openFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  const clearForm = () => {
    setUploadedImage(null);
    setSelectedDestination("");
    setDistination("");
  };

  // fetching StorePublicity data
  const fetchStorePublicityData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Publicity/fetchAllStorePublicities/${decodedToken.id}`,
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
      else throw new Error("Error receiving StorePublicity data");
    }
    // Return the data
    return await response.json();
  };

  // useQuery hook to fetch data
  const {
    data: StorePublicityData,
    error: StorePublicityError,
    isLoading: StorePublicityLoading,
    refetch: StorePublicityRefetch,
  } = useQuery({
    queryKey: ["StorePublicityData", user?.token, location.key],
    queryFn: fetchStorePublicityData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
  });

  //save Publicity API
  const handleSavePublicity = async () => {
    if (!uploadedImage || !Distination) {
      setAlertType(true);
      setSnackbarMessage(
        language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Veuillez remplir tous les champs requis"
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      setSubmitionLoading(true);
      setSubmittingPub(true);

      const formData = new FormData();
      formData.append("file", uploadedImage);
      formData.append("distination", Distination);

      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/Publicity/createFromStore/${decodedToken.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        StorePublicityRefetch();
        clearForm();
        handleCloseModalAddPub();
      } else {
        setAlertType(true);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response) {
        setAlertType(true);
        setSnackbarMessage(error.response.data.message);
        setSnackbarOpen(true);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error creating Publicity: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating Publicity", error);
      }
    } finally {
      setSubmitionLoading(false);
      setSubmittingPub(false);
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
            {language === "ar" ? "الإعلانات" : "Publicité"}
          </h2>
          <ButtonAdd
            buttonSpan={
              language === "ar" ? "إضافة إعلان" : "Ajouter une publicité"
            }
            onClick={handleOpenModalAddPub}
            language={language}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar mb-6">
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "إجمالي الإعلانات" : "Total des publicités"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            StorePublicityData?.length ? StorePublicityData.length : 0
          }
          loading={StorePublicityLoading}
        />
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "الإعلانات الخاصة" : "Publicités privées"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            StorePublicityData?.filter((pub) => pub.distination === "private")
              .length || 0
          }
          loading={StorePublicityLoading}
        />
        <OrderCard
          language={language}
          orderCardTitle={
            language === "ar" ? "الإعلانات العامة" : "Publicités publiques"
          }
          className="flex-shrink-0 w-[280px] md:w-full"
          orderCardDetails={
            StorePublicityData?.filter((pub) => pub.distination === "public")
              .length || 0
          }
          loading={StorePublicityLoading}
        />
      </div>

      <PubSwiperStore
        data={StorePublicityData}
        loading={StorePublicityLoading}
        StorePublicityRefetch={StorePublicityRefetch}
        user={user}
        language={language}
        handleOpenModalAddPub={handleOpenModalAddPub}
      />

      <Modal
        isOpen={openModelAddPub}
        onRequestClose={handleCloseModalAddPub}
        contentLabel={
          language === "ar"
            ? "إضافة إعلان جديد"
            : "Ajouter une nouvelle publicité"
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
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إضافة إعلان جديد"
              : "Ajouter une nouvelle publicité"}
          </h2>

          <div className="mt-[20px]">
            <div
              className="w-full h-[300px] flex justify-center items-center border-dashed border-[2px] border-gray-400 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors relative overflow-hidden"
              onClick={openFileInput}
            >
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                  />
                  <button
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p
                    className="uploadSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    <span className="text-blue-600 font-medium">
                      {language === "ar"
                        ? "انقر لتحميل"
                        : "Cliquez pour télécharger"}{" "}
                    </span>
                    <br />
                    {language === "ar"
                      ? "أو اسحب وأسقط SVG, PNG, JPG"
                      : "ou faites glisser et déposez SVG, PNG, JPG"}
                  </p>
                </div>
              )}
              <input
                id="imageUploadInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div
            className={`flex items-center mt-6 ${
              language === "ar" ? "gap-x-5" : "space-x-5"
            }`}
          >
            <span
              className="text-gray-700 font-medium"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الوجهة :" : "Destination :"}
            </span>
            <div className="selectStoreWilayaCommune w-[300px]">
              <select
                name="productCategory"
                onChange={handleDistinationChange}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                <option
                  value=""
                  disabled
                  selected
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "-- اختر الوجهة --"
                    : "-- Sélectionner la destination --"}
                </option>
                <option
                  value="private"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "خاص" : "Privé"}
                </option>
                <option
                  value="public"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "عام" : "Public"}
                </option>
              </select>
            </div>
          </div>

          <div
            className={`flex justify-end mt-8 ${
              language === "ar" ? "gap-x-8" : "space-x-8"
            }`}
          >
            {!submittingPub ? (
              <>
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseModalAddPub}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={handleSavePublicity}
                  disabled={!uploadedImage || !selectedDestination}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    opacity: !uploadedImage || !selectedDestination ? 0.5 : 1,
                  }}
                >
                  {language === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </>
            ) : (
              <div className="pr-8 py-2">
                <CircularProgress size={24} color="primary" />
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: language === "ar" ? "left" : "right",
        }}
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
