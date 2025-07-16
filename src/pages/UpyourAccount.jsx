import React, { useState, useEffect } from "react";
import UpAccountImage from "../assets/images/UpAccount.png";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "../components/ConfirmDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import Modal from "react-modal";

import Logo from "../assets/Logo-mosagro.png";

export default function UpYourAccount(language, onToggle, toggleLanguage) {
  const { user } = useAuthContext();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dialogSelectedCategories, setDialogSelectedCategories] = useState([]);
  const [errorInDialog, setErrorInDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryAdded, setCategoryAdded] = useState(false);

  //form
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Address, setAddress] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [R_Commerce, setR_Commerce] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //handle change functions
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleStoreNameChange = (e) => {
    setStoreName(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleR_CommerceChange = (e) => {
    setR_Commerce(e.target.value);
  };
  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
  };
  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
  };

  //clear form
  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setStoreName("");
    setR_Commerce("");
    setSelectedWilaya(null);
    setSelectedCommune(null);
    setSelectedCategories([]);
  };

  const handleRedirect = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (openDialog) {
      setDialogSelectedCategories(selectedCategories);
      setErrorInDialog(false);
    }
  }, [openDialog, selectedCategories]);

  const handleAddCategoryClick = (event) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCategorySelect = (category) => {
    setDialogSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveCategories = () => {
    if (dialogSelectedCategories.length == 0) {
      setErrorInDialog(true);
      return;
    }
    setSelectedCategories(dialogSelectedCategories);
    setOpenDialog(false);
    setCategoryAdded(true);
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setSelectedCategories(
      selectedCategories.filter((c) => c !== categoryToDelete)
    );
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  //---------------------------------API calls---------------------------------\\

  // fetching Categorys data
  const fetchCategoryData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Category data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: CategoryData,
    error: CategoryError,
    isLoading: CategoryLoading,
    refetch: CategoryRefetch,
  } = useQuery({
    queryKey: ["CategoryData", id, location.key],
    queryFn: fetchCategoryData,
    enabled: !!id,
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Cities data
  const fetchCitiesData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Cities/fr`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Cities data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: CitiesData,
    error: CitiesError,
    isLoading: CitiesLoading,
    refetch: CitiesRefetch,
  } = useQuery({
    queryKey: ["CitiesData", id, location.key],
    queryFn: fetchCitiesData,
    enabled: !!id,
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });
  // Filter wilayas
  const wilayas =
    CitiesData?.length > 0
      ? CitiesData.filter((city) => city.codeC == `${city.codeW}001`).map(
          (city) => ({ value: city.codeW, label: city.wilaya })
        )
      : [];

  // Filter communes
  const communes =
    selectedWilaya && CitiesData?.length > 0
      ? CitiesData.filter((city) => city.codeW == selectedWilaya)
          .filter((city) => city.codeC !== `${city.codeW}001`)
          .map((city) => ({ value: city.codeC, label: city.baladiya }))
      : [];

  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    CitiesRefetch();
  };

  //save Fournisseur API
  const handleUpdateStore = async () => {
    if (Password !== ConfirmPassword) {
      setAlertType(true);
      setSnackbarMessage("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/auth/signup/store/${id}`,
        {
          Password: Password,
          FirstName: FirstName,
          LastName: LastName,
          Category: selectedCategories.map((category) => {
            return category._id;
          }),
          Wilaya: selectedWilaya,
          Commune: selectedCommune,
          R_Commerce: R_Commerce,
          Address: Address,
          storeName: StoreName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        clearForm();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        handleRefetchDataChange();
        setSubmitionLoading(false);
        setTimeout(() => {
          handleRedirect("/");
        }, 1500);
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
        console.error(
          "Error updating store new informations: No response received"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating store new informations", error);
      }
    }
  };

  return (
    <div className="signUp">
      <div className="w-full min-h-[80px] sm:h-[80px] flex justify-between items-center px-4 md:pl-10 md:pr-10 py-4 sm:py-0 border-b-2 border-[#C9E4EE] relative">
        <div
          className={`flex items-center ${
            language === "ar" ? "flex-row-reverse gap-x-2" : "space-x-2"
          }`}
        >
          <img src={Logo} alt="Store Logo" className="h-6" />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full lg:w-[65%] lg:border-r-2 border-[#C9E4EE] paddingUpYourAccount">
          <h2 className="titleText">
            {language === "ar" ? (
              <>لنقم بإعداد حسابك.</>
            ) : (
              <>Configurons votre compte.</>
            )}
          </h2>

          <div className="paddingUpYourAccountSpecail mt-[32px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <InputForm
              labelForm={language === "ar" ? "الاسم" : "Prénom"}
              inputType="text"
              inputPlaceholder={language === "ar" ? "اسمك" : "Votre prénom"}
              inputName="firstName"
              setChangevalue={handleFirstNameChange}
              value={FirstName}
            />
            <InputForm
              labelForm={language === "ar" ? "الاسم العائلي" : "Nom"}
              inputType="text"
              inputPlaceholder={
                language === "ar" ? "اسمك العائلي" : "Votre nom"
              }
              inputName="lastName"
              setChangevalue={handleLastNameChange}
              value={LastName}
            />
            <InputForm
              labelForm={language === "ar" ? "كلمة المرور" : "Mot de passe"}
              inputType="password"
              inputPlaceholder={
                language === "ar"
                  ? "كلمة المرور الخاصة بك"
                  : "Votre mot de passe"
              }
              inputName="Password"
              setChangevalue={handlePasswordChange}
              value={Password}
            />
            <InputForm
              labelForm={
                language === "ar"
                  ? "تأكيد كلمة المرور"
                  : "Confirmer le mot de passe"
              }
              inputType="password"
              inputPlaceholder={
                language === "ar"
                  ? "أكد كلمة المرور الخاصة بك"
                  : "Confirmez votre mot de passe"
              }
              inputName="ConfirmPassword"
              setChangevalue={handleConfirmPasswordChange}
              value={ConfirmPassword}
            />
            <InputForm
              labelForm={language === "ar" ? "اسم المتجر" : "Nom du magasin"}
              inputType="text"
              inputPlaceholder={
                language === "ar" ? "اسم متجرك" : "Nom de votre magasin"
              }
              inputName="storeName"
              setChangevalue={handleStoreNameChange}
              value={StoreName}
            />
            <InputForm
              labelForm={language === "ar" ? "العنوان" : "Adresse"}
              inputType="text"
              inputPlaceholder={language === "ar" ? "عنوانك" : "Votre adresse"}
              inputName="storeAddress"
              setChangevalue={handleAddressChange}
              value={Address}
            />
            <InputForm
              labelForm={
                language === "ar"
                  ? "رقم السجل التجاري"
                  : "Numéro de registre du commerce"
              }
              inputType="number"
              inputPlaceholder={
                language === "ar"
                  ? "رقم السجل التجاري الخاص بك"
                  : "Votre numéro de registre du commerce"
              }
              inputName="RC"
              setChangevalue={handleR_CommerceChange}
              value={R_Commerce}
            />
          </div>

          <div className="paddingUpYourAccountSpecail mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <div className="upyouraccountselect flex-col space-y-[12px] items-center">
              <span>{language === "ar" ? "الولاية" : "Wilaya"}</span>
              <div className="selectStoreWilayaCommune">
                <select
                  name="storeWilaya"
                  value={selectedWilaya}
                  onChange={handleWilayaChange}
                >
                  <option value="" disabled selected>
                    {language === "ar"
                      ? "اختر الولاية"
                      : "Sélectionnez une wilaya"}
                  </option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.value} value={wilaya.value}>
                      {wilaya.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="upyouraccountselect flex-col space-y-[12px] items-center">
              <span>{language === "ar" ? "البلدية" : "Commune"}</span>
              <div className="selectStoreWilayaCommune">
                <select
                  name="storeCommune"
                  value={selectedCommune}
                  onChange={handleCommuneChange}
                >
                  <option value="" disabled selected>
                    {language === "ar"
                      ? "اختر البلدية"
                      : "Sélectionnez une commune"}
                  </option>
                  {communes.map((commune) => (
                    <option key={commune.value} value={commune.value}>
                      {commune.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-col storeCategory space-y-[12px] mt-4 md:mt-6">
            <span>
              {language === "ar" ? "فئة المتجر" : "Catégorie du magasin"}
            </span>
            <div className="selectedCategories">
              {selectedCategories.map((category, index) => (
                <div key={index} className="categoryChip">
                  <span>{category.name}</span>
                  <XMarkIcon
                    className="deleteIcon"
                    onClick={() => handleDeleteCategory(category)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="buttonAdd buttonBorder mt-6"
            onClick={handleAddCategoryClick}
            type="button"
          >
            <PlusIcon className="iconAsideBar" />
            <span className="buttonTextLight">
              {language === "ar" ? "إضافة فئة المتجر" : "Ajouter une catégorie"}
            </span>
          </button>

          <div className="mt-4 md:mt-6">
            <ButtonDark
              buttonSpan={language === "ar" ? "متابعة" : "Continuer"}
              setOnClick={handleUpdateStore}
            />
          </div>
        </div>

        <div className="mobile-hidden">
          <img className="h-[80%]" src={UpAccountImage} alt="Up Account" />
        </div>
      </div>
      <Modal
        isOpen={openDialog}
        onRequestClose={handleCloseDialog}
        contentLabel="Select your Store Category"
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!CategoryLoading ? (
          <div className="customerClass p-0">
            {errorInDialog && (
              <Alert severity="error" onClose={() => setErrorInDialog(false)}>
                {language === "ar"
                  ? "يرجى اختيار فئة واحدة على الأقل."
                  : "Veuillez sélectionner au moins une catégorie."}{" "}
              </Alert>
            )}
            <h2 className="customerClassTitle">
              {language === "ar"
                ? "اختر فئة متجرك"
                : "Sélectionnez la catégorie de votre magasin"}
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 w-full overflow-y-auto">
              {CategoryData?.length > 0 ? (
                CategoryData?.map((category, index) => (
                  <div
                    key={index}
                    className={`storyCategoryItem ${
                      dialogSelectedCategories.includes(category)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <span>{category.name}</span>
                  </div>
                ))
              ) : (
                <h1>
                  {language === "ar"
                    ? "لا توجد بيانات متاحة"
                    : "Aucune donnée disponible"}
                </h1>
              )}
            </div>
            {
              <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseDialog}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={handleSaveCategories}
                >
                  {language === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </div>
            }
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-8 pr-8 h-[60px] mt-2">
            <CircularProgress color="inherit" />
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        dialogTitle={
          language === "ar" ? "تأكيد الحذف" : "Confirmation de la suppression"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد حذف الفئة "${categoryToDelete?.name}"؟`
            : `Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete?.name}" ?`
        }
      />
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
