import React, { useState, useEffect } from "react";
import {
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CalendarDateRangeIcon,
  ArrowLeftCircleIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLongRightIcon,
  PhotoIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import InputForm from "../components/InputForm";
import { wilayasAndCommunes } from "../util/WilayaCommunesData";
import ButtonDelete from "../components/ButtonDelete";
import ButtonSave from "../components/ButtonSave";
import { Link, useLocation, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ConfirmDialog from "../components/ConfirmDialog";
import ButtonModify from "../components/ButtonModify";
import axios from "axios";
import Modal from "react-modal";
import InputFormPassword from "../components/InputFormPassword";
import SubscriptionCard from "../components/SubscriptionCard";
import { Menu, MenuItem } from "@mui/material";

export default function Settings({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [
    openConfirmationDeleteCategoryDialog,
    setOpenConfirmationDeleteCategoryDialog,
  ] = useState(false);
  const handleOpenConfirmationDialog = () => setOpenConfirmationDialog(true);

  const [openUpdateConfirmationDialog, setOpenUpdateConfirmationDialog] =
    useState(false);
  const handleOpenUpdateConfirmationDialog = () =>
    setOpenUpdateConfirmationDialog(true);

  const [
    openUpdateEmailPasswordConfirmationDialog,
    setOpenUpdateEmailPasswordConfirmationDialog,
  ] = useState(false);
  const handleOpenUpdateEmailPasswordConfirmationDialog = () =>
    setOpenUpdateEmailPasswordConfirmationDialog(true);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedConfirmEmail, setUpdatedConfirmEmail] = useState("");
  const [updatedNewPassword, setUpdatedNewPassword] = useState("");
  const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState("");
  const [updatedOldPassword, setUpdatedOldPassword] = useState("");

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
    setOpenUpdateConfirmationDialog(false);
    setOpenUpdateEmailPasswordConfirmationDialog(false);
  };

  const handleOpenDeleteCategoryDialog = () => {
    setOpenConfirmationDeleteCategoryDialog(true);
  };

  const handleCloseDeleteCategoryDialog = () => {
    setOpenConfirmationDeleteCategoryDialog(false);
  };

  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);

  const handleOpenAddCategoryModal = () => {
    setOpenAddCategoryModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setOpenAddCategoryModal(false);
  };

  const [activeTab, setActiveTab] = useState("PersoInf");
  const handleTabClick = (tab) => setActiveTab(tab);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmailPassword, setIsEditingEmailPassword] = useState(false);
  const [editableData, setEditableData] = useState({
    firstName: "",
    lastName: "",
    wilaya: "",
    commune: "",
    storeAddress: "",
    storeName: "",
    storeLocation: "",
  });

  const handleClickModify = () => {
    setIsEditing(true);
    setEditableData({
      firstName: "",
      lastName: "",
      wilaya: "",
      commune: "",
      storeAddress: "",
      storeName: "",
      storeLocation: "",
      RC: "",
    });
  };

  const [showModifyMenu, setShowModifyMenu] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleClickModifyMenu = (event) => {
    setShowModifyMenu(event.currentTarget);
  };

  const handleCloseModifyMenu = () => {
    setShowModifyMenu(null);
  };

  const handleModifyEmail = () => {
    setIsEditingEmail(true);
    setIsEditingPassword(false); // Hide password fields
    handleCloseModifyMenu();
  };

  const handleModifyPassword = () => {
    setIsEditingPassword(true);
    setIsEditingEmail(false); // Hide email fields
    handleCloseModifyMenu();
  };

  const handleCancel = () => {
    setIsEditingEmail(false);
    setIsEditingPassword(false);
  };

  const handleClickCancel = () => {
    setIsEditing(false);
    // Reset the form to original values
    if (CustomerData) {
      setEditableData({
        firstName: CustomerData.firstName || "",
        lastName: CustomerData.lastName || "",
        email: CustomerData.email || "",
        phoneNumber: CustomerData.phoneNumber || "",
        wilaya: CustomerData.wilaya || "",
        commune: CustomerData.commune || "",
        storeAddress: CustomerData.storeAddress || "",
        storeName: CustomerData.storeName || "",
        storeLocation: CustomerData.storeLocation || "",
        RC: CustomerData.r_commerce || "",
      });
    }
  };

  const handleInputChange = (e) => {
    setEditableData({
      ...editableData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmDeleteAccount = async () => {
    alert("delete");
  };

  const [
    openAddCategoryConfirmationDialog,
    setOpenAddCategoryConfirmationDialog,
  ] = useState(false);
  const handleOpenAddCategoryConfirmationDialog = () => {
    setOpenAddCategoryConfirmationDialog(true);
  };
  const handleCloseAddCategoryConfirmationDialog = () => {
    setOpenAddCategoryConfirmationDialog(false);
  };

  const TakeMeToGoogleMaps = async (val) => {
    alert(val);
  };

  const [selectedCategorie, setSelectedCategorie] = useState("");
  const handleProductCategoryChange = (e) => {
    setSelectedCategorie(e.target.value);
  };

  const [openModelSubscibe, setOpenModelSubscibe] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const handleOpenModalSubscription = (val) => {
    setSelectedSubscription(val);
    setOpenModelSubscibe(true);
  };

  const handleCloseModalSubscription = () => {
    setSelectedSubscription(null);
    setOpenModelSubscibe(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Define a function that fetches the customer data
  const fetchCustomerData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Store/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) return {};
      else throw new Error("Error receiving Customer data");
    }
    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the customer data
  const {
    data: CustomerData,
    error: CustomerDataError,
    isLoading: CustomerDataLoading,
    refetch: refetchCustomerDataData,
  } = useQuery({
    queryKey: ["CustomerData", user?.token, location.key],
    queryFn: fetchCustomerData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // Define a function that fetches the customer data
  const fetchCategoryData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) return {};
      else throw new Error("Error receiving Category data");
    }
    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the Category data
  const {
    data: CategoryData,
    error: CategoryDataError,
    isLoading: CategoryDataLoading,
    refetch: refetchCategoryData,
  } = useQuery({
    queryKey: ["CategoryData", user?.token, location.key],
    queryFn: fetchCategoryData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // Define a function that fetches the customer data
  const fetchCategoryDataByStore = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Category/store/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) return {};
      else throw new Error("Error receiving Category data");
    }
    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the Category data
  const {
    data: CategoryDataByStore,
    error: CategoryDataByStoreError,
    isLoading: CategoryDataByStoreLoading,
    refetch: refetchCategoryDataByStoreData,
  } = useQuery({
    queryKey: ["CategoryDataByStore", user?.token, location.key],
    queryFn: fetchCategoryDataByStore,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });
  //fetch data
  const fetchSubscriptionsData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Subscription`,
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
        throw new Error("Error receiving subscriptions data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: SubscriptionsData,
    error: SubscriptionsDataError,
    isLoading: SubscriptionsDataLoading,
    refetch: refetchSubscriptionsData,
  } = useQuery({
    queryKey: ["SubscriptionsData", user?.token, location.key],
    queryFn: fetchSubscriptionsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  useEffect(() => {
    if (CustomerData) {
      setEditableData({
        firstName: CustomerData.firstName || "",
        lastName: CustomerData.lastName || "",
        email: CustomerData.email || "",
        phoneNumber: CustomerData.phoneNumber || "",
        wilaya: CustomerData.wilaya || "",
        commune: CustomerData.commune || "",
        storeAddress: CustomerData.storeAddress || "",
        storeName: CustomerData.storeName || "",
        storeLocation: CustomerData.storeLocation || "",
        RC: CustomerData.RC || "",
      });
    }
  }, [CustomerData]);

  const handleClickSave = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Store/${decodedToken.id}`,
        {
          firstName: editableData.firstName,
          lastName: editableData.lastName,
          wilaya: editableData.wilaya,
          commune: editableData.commune,
          address: editableData.storeAddress,
          storeName: editableData.storeName,
          location: editableData.storeLocation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchCustomerDataData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialog();
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
        console.error("Error updating profile: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating profile");
      }
    }
  };
  const handleAddCategoriesToStore = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Category/store/add/${decodedToken.id}`,
        {
          category: selectedCategorie,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchCategoryData();
        refetchCategoryDataByStoreData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseAddCategoryModal();
        handleCloseAddCategoryConfirmationDialog();
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
        console.error("Error adding category: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding category");
      }
    }
  };
  const handleSubmitNewSubscription = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/SubscriptionStore/create/${decodedToken?.id}`,
        {
          Store: decodedToken.id,
          Subscription: selectedSubscription,
          expiryMonths: selectedDuration,
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
        handleCloseModalSubscription();
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
        console.error("Error updating profile: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating profile");
      }
    }
  };
  const handleUpdateEmailPassword = async () => {
    try {
      let response;
      if (isEditingPassword) {
        setSubmitionLoading(true);
        if (updatedNewPassword != updatedConfirmPassword) {
          setAlertType(true);
          setSnackbarMessage("Passwords do not match");
          setSnackbarOpen(true);
          setSubmitionLoading(false);
          return;
        }
        response = await axios.patch(
          import.meta.env.VITE_APP_URL_BASE +
            `/Auth/updateStorePassword/${decodedToken.id}`,
          {
            OldPassword: updatedOldPassword,
            NewPassword: updatedNewPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      } else if (isEditingEmail) {
        setSubmitionLoading(true);
        if (updatedEmail != updatedConfirmEmail) {
          setAlertType(true);
          setSnackbarMessage("Emails do not match");
          setSnackbarOpen(true);
          setSubmitionLoading(false);
          return;
        }
        response = await axios.patch(
          import.meta.env.VITE_APP_URL_BASE +
            `/Auth/updateStoreEmail/${decodedToken.id}`,
          {
            Email: updatedEmail,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      } else {
        return;
      }

      if (response.status === 200) {
        refetchCustomerDataData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialog();
        setUpdatedEmail("");
        setUpdatedConfirmEmail("");
        setUpdatedNewPassword("");
        setUpdatedConfirmPassword("");
        setUpdatedOldPassword("");
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
        console.error("Error updating email or password: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating email or password");
      }
    }
  };
  return (
    <div
      className="settingsContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pageTable h-[100vh] flex-row">
        {/* Left Sidebar */}
        <div
          className={`settingsLeft flex-col space-y-[32px] bg-white rounded-lg shadow-sm p-6 ${
            language === "ar" ? "settingsLeftB" : ""
          }`}
        >
          <Link
            to="/dashboard"
            className="relative flex items-center space-x-2 text-gray-700 font-semibold transition-all duration-300"
          >
            <span className="relative flex items-center space-x-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full">
              {language === "ar" ? (
                <div className="flex items-center space-x-2">
                  <ArrowLongRightIcon className="w-5 h-5 text-gray-600" />
                  <span style={{ fontFamily: "Cairo-Regular, sans-serif" }}>
                    العودة إلى لوحة التحكم
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ArrowLongLeftIcon className="w-5 h-5 text-gray-600" />
                  <span>Retour au tableau de bord</span>
                </div>
              )}
            </span>
          </Link>

          <h2
            className="pagesTitle text-xl font-bold text-gray-800 border-b pb-3"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إدارة الملف الشخصي"
              : "Gestion du profil utilisateur"}
          </h2>

          <div
            className={`flex-col settingsBar space-y-4 ${
              activeTab === "PersoInf" || activeTab === "EmailPass"
                ? "AllTransparent"
                : ""
            }`}
          >
            <div
              className={`flex items-center p-3 gap-x-2 rounded-md transition-all duration-200 ${
                activeTab === "PersoInf"
                  ? "bg-[#2388FF] text-white border-[#2388FF] shadow-sm"
                  : "text-[#000] hover:bg-[#353E5C] hover:text-white"
              } cursor-pointer group`}
              onClick={() => handleTabClick("PersoInf")}
            >
              <UserIcon
                className={`w-5 h-5 transition-all duration-200 ${
                  activeTab === "PersoInf"
                    ? "text-white"
                    : "text-[#000] group-hover:text-white"
                }`}
              />
              <span
                className={`ml-3 ${
                  activeTab === "PersoInf" ? "font-medium" : ""
                }`}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "المعلومات الشخصية"
                  : "Informations personnelles"}
              </span>
            </div>

            <div
              className={`flex items-center p-3 gap-x-2 rounded-md transition-all duration-200 ${
                activeTab === "EmailPass"
                  ? "bg-[#2388FF] text-white border-[#2388FF] shadow-sm"
                  : "text-[#000] hover:bg-[#353E5C] hover:text-white"
              } cursor-pointer group`}
              onClick={() => handleTabClick("EmailPass")}
            >
              <ShieldCheckIcon
                className={`w-5 h-5 ${
                  activeTab === "EmailPass"
                    ? "text-white"
                    : "text-[black] group-hover:text-white"
                }`}
              />
              <span
                className={`ml-3 ${
                  activeTab === "EmailPass" ? "font-medium" : ""
                }`}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "البريد الإلكتروني وكلمة المرور"
                  : "E-mail & Mot de passe"}
              </span>
            </div>

            {/* <div
              className={`flex items-center p-3 gap-x-2 rounded-md transition-all duration-200 ${
                activeTab === "Subscription"
                  ? "bg-[#e7f2f7] text-[#3e9cb9]"
                  : "text-gray-700 hover:bg-[#e7f2f7] hover:text-[#3e9cb9]"
              } cursor-pointer group`}
              onClick={() => handleTabClick("Subscription")}
            >
              <CalendarDateRangeIcon
                className={`w-5 h-5 ${
                  activeTab === "Subscription"
                    ? "text-[#3e9cb9]"
                    : "text-gray-500 group-hover:text-[#3e9cb9]"
                }`}
              />
              <span
                className={`ml-3 ${
                  activeTab === "Subscription" ? "font-medium" : ""
                }`}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الاشتراك" : "Abonnement"}
              </span>
            </div> */}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="settingsRight bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Personal Information Tab */}
         {activeTab === "PersoInf" && (
  <div className="flex-col settingsRightContainer">
    <div className="flex md:items-center items-start md:justify-between justify-start md:flex-row flex-col border-b pb-4 md:space-y-0 space-y-4">
      <h2
        className="md:text-xl text-lg font-bold text-gray-800"
        style={{
          fontFamily:
            language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
      >
        {language === "ar"
          ? "المعلومات الشخصية"
          : "Informations personnelles"}
      </h2>
      <div
        className={`flex md:space-x-4 space-x-2 ${
          language === "ar" ? "md:gap-x-4 gap-x-2" : ""
        }`}
      >
        {isEditing ? (
          <div
            className={`flex md:space-x-4 space-x-2 ${
              language === "ar" ? "md:gap-x-4 gap-x-2" : ""
            }`}
          >
            <ButtonModify
              buttonSpan={language === "ar" ? "إلغاء" : "Annuler"}
              showIcon={false}
              onClick={handleClickCancel}
              language={language}
            />
            <ButtonSave
              setOnClick={handleOpenUpdateConfirmationDialog}
              language={language}
            />
          </div>
        ) : (
          <ButtonModify
            buttonSpan={language === "ar" ? "تعديل" : "Modifier"}
            onClick={handleClickModify}
            language={language}
          />
        )}
      </div>
    </div>

    {!CustomerDataLoading ? (
      <div className="flex-col settingsRightScroll">
        <div className="bg-white rounded-lg">
          <div className="settingPersonalInformation grid grid-cols-1 lg:grid-cols-2 md:gap-6 gap-4 p-4 md:p-0">
            <div className="col-span-1">
              <InputForm
                labelForm={
                  language === "ar" ? "البريد الإلكتروني" : "E-mail"
                }
                inputType="email"
                inputName="email"
                value={editableData.email}
                readOnly={true}
                language={language}
              />
            </div>
            <div className="col-span-1">
              <InputForm
                labelForm={
                  language === "ar"
                    ? "رقم الهاتف"
                    : "Numéro de téléphone"
                }
                inputType="phone"
                inputName="phone"
                value={editableData.phoneNumber}
                inputPlaceholder={
                  language === "ar" ? "غير متوفر" : "Non disponible"
                }
                readOnly={true}
                language={language}
              />
            </div>
            <div className="col-span-1">
              <InputForm
                labelForm={
                  language === "ar" ? "اسم المتجر" : "Nom du magasin"
                }
                inputType="text"
                inputName="storeName"
                value={editableData.storeName}
                setChangevalue={handleInputChange}
                readOnly={!isEditing}
                language={language}
              />
            </div>
            <div className="col-span-1">
              <InputForm
                labelForm={language === "ar" ? "الاسم الأول" : "Prénom"}
                inputType="text"
                inputName="firstName"
                value={editableData.firstName}
                setChangevalue={handleInputChange}
                readOnly={!isEditing}
                language={language}
              />
            </div>
            <div className="col-span-1">
              <InputForm
                labelForm={
                  language === "ar" ? "اسم العائلة" : "Nom de famille"
                }
                inputType="text"
                inputName="lastName"
                value={editableData.lastName}
                setChangevalue={handleInputChange}
                readOnly={!isEditing}
                language={language}
              />
            </div>
            <div className="inputItem col-span-1">
              <span
                style={{
                  fontFamily:
                    language === "ar"
                      ? "Cairo-Regular, sans-serif"
                      : "",
                }}
              >
                {language === "ar" ? "العنوان" : "Adresse"}
              </span>
              <div
                className={`inputForm relative ${
                  language === "ar" ? "inputFormReverse " : ""
                }`}
              >
                <input
                  type="text"
                  name="storeAddress"
                  value={editableData.storeAddress}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "Cairo-Regular, sans-serif"
                        : "",
                  }}
                />
                <MapIcon
                  onClick={() =>
                    TakeMeToGoogleMaps(editableData.storeAddress)
                  }
                  className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                />
              </div>
            </div>

            {isEditing ? (
              <>
                <div className="flex-col space-y-[12px] items-center col-span-1">
                  <span
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "Cairo-Regular, sans-serif"
                          : "",
                    }}
                  >
                    {language === "ar" ? "الولاية" : "Wilaya"}
                  </span>
                  <div className="selectStoreWilayaCommune w-full max-w-[400px]">
                    <select
                      name="wilaya"
                      value={editableData.wilaya}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "Cairo-Regular, sans-serif"
                            : "",
                      }}
                    >
                      <option value="">
                        {language === "ar"
                          ? "اختر الولاية"
                          : "Sélectionner Wilaya"}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex-col space-y-[12px] items-center col-span-1">
                  <span
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "Cairo-Regular, sans-serif"
                          : "",
                    }}
                  >
                    {language === "ar" ? "البلدية" : "Commune"}
                  </span>
                  <div className="selectStoreWilayaCommune w-full max-w-[400px]">
                    <select
                      name="commune"
                      value={editableData.commune}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "Cairo-Regular, sans-serif"
                            : "",
                      }}
                    >
                      <option value="">
                        {language === "ar"
                          ? "اختر البلدية"
                          : "Sélectionner Commune"}
                      </option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-1">
                  <InputForm
                    labelForm={language === "ar" ? "الولاية" : "Wilaya"}
                    inputType="text"
                    inputName="wilaya"
                    value={editableData.wilaya}
                    setChangevalue={handleInputChange}
                    readOnly={!isEditing}
                    language={language}
                  />
                </div>
                <div className="col-span-1">
                  <InputForm
                    labelForm={
                      language === "ar" ? "البلدية" : "Commune"
                    }
                    inputType="text"
                    inputName="commune"
                    value={editableData.commune}
                    setChangevalue={handleInputChange}
                    readOnly={!isEditing}
                    language={language}
                  />
                </div>
              </>
            )}

            {!CategoryDataByStoreLoading ? (
              <div className="flex-col space-y-[12px] col-span-1 lg:col-span-2">
                <span
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "Cairo-Regular, sans-serif"
                        : "",
                  }}
                >
                  {language === "ar"
                    ? "فئة المتجر"
                    : "Catégorie du magasin"}
                </span>
                <div className="flex md:flex-row flex-col md:space-x-4 md:space-y-0 space-y-3 items-start md:items-center">
                  <div className="selectedCategories flex flex-wrap gap-2 w-full">
                    {CategoryDataByStore?.map((category, index) => (
                      <div
                        key={index}
                        className="categoryChip bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-sm break-all"
                      >
                        <span
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                        >
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <PlusCircleIcon
                    className="h-6 w-6 text-blue-600 cursor-pointer hover:text-blue-800 flex-shrink-0 md:mt-0 mt-2"
                    onClick={handleOpenAddCategoryModal}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center col-span-1 lg:col-span-2">
                <CircularProgress color="inherit" />
              </div>
            )}
          </div>
        </div>

        <div className="deleteContainer flex-col space-y-4 mt-5 bg-gray-50 md:p-6 p-4 rounded-lg border border-gray-200">
          <span
            className="md:text-lg text-base font-semibold text-red-600"
            style={{
              fontFamily:
                language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "حذف الحساب" : "Supprimer le compte"}
          </span>

          <div className="bg-white w-full md:p-4 p-3 rounded-lg border border-gray-100 shadow-sm flex md:space-x-3 space-x-2">
            <ShieldExclamationIcon className="md:w-6 md:h-6 w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p
              className="md:text-sm text-xs text-gray-600"
              style={{
                fontFamily:
                  language === "ar"
                    ? "Cairo-Regular, sans-serif"
                    : "",
              }}
            >
              {language === "ar"
                ? 'بعد طلب الحذف، سيكون لديك مدة "6 أشهر" للاحتفاظ بهذا الحساب.'
                : 'Après avoir fait une demande de suppression, vous aurez "6 mois" pour maintenir ce compte.'}
            </p>
          </div>

          <p
            className="md:text-sm text-xs text-gray-500"
            style={{
              fontFamily:
                language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "عند حذف حسابك، ستفقد جميع البيانات المرتبطة به بشكل نهائي. لا يمكن التراجع عن هذا الإجراء."
              : "Lorsque vous supprimez votre compte, vous perdrez définitivement toutes les données associées. Cette action ne peut pas être annulée."}
          </p>

          <p
            className="md:text-sm text-xs font-medium text-gray-700"
            style={{
              fontFamily:
                language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "لا يمكن التراجع عن هذا الإجراء."
              : "Cette action est irréversible."}
          </p>

          <div className="md:w-auto w-full">
            <ButtonDelete
              setOnClick={handleOpenConfirmationDialog}
              language={language}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-full">
        <CircularProgress color="inherit" />
      </div>
    )}

    <ConfirmDialog
      open={openConfirmationDialog}
      onClose={handleCloseDialog}
      onConfirm={handleConfirmDeleteAccount}
      dialogTitle={
        language === "ar"
          ? "تأكيد حذف حسابك"
          : "Confirmer la suppression de votre compte"
      }
      dialogContentText={
        language === "ar"
          ? "هل أنت متأكد أنك تريد حذف حسابك؟"
          : "Êtes-vous sûr de vouloir supprimer votre compte ?"
      }
      language={language}
    />
  </div>
)}

          {/* Email & Password Tab */}
          {activeTab === "EmailPass" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader mb-6 border-b pb-4">
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "البريد الإلكتروني وكلمة المرور"
                    : "E-mail & Mot de passe"}
                </h2>
                <div className="flex space-x-4">
                  {isEditingEmail || isEditingPassword ? (
                    <div
                      className={`flex space-x-4 ${
                        language === "ar" ? "gap-x-4" : ""
                      }`}
                    >
                      <ButtonModify
                        buttonSpan={language === "ar" ? "إلغاء" : "Annuler"}
                        showIcon={false}
                        onClick={handleCancel}
                        language={language}
                      />
                      <ButtonSave
                        setOnClick={
                          handleOpenUpdateEmailPasswordConfirmationDialog
                        }
                        language={language}
                      />
                    </div>
                  ) : (
                    <>
                      <ButtonModify
                        buttonSpan={language === "ar" ? "تعديل" : "Modifier"}
                        onClick={handleClickModifyMenu}
                        language={language}
                      />
                      <Menu
                        anchorEl={showModifyMenu}
                        open={Boolean(showModifyMenu)}
                        onClose={handleCloseModifyMenu}
                      >
                        <MenuItem onClick={handleModifyEmail}>
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "تعديل البريد الإلكتروني"
                              : "Modifier l'e-mail"}
                          </span>
                        </MenuItem>
                        <MenuItem onClick={handleModifyPassword}>
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "تعديل كلمة المرور"
                              : "Modifier le mot de passe"}
                          </span>
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-col settingsRightScroll bg-white rounded-lg">
                <div>
                  <div className="settingPersonalInformation grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isEditingPassword === false && (
                      <>
                        <InputForm
                          labelForm={
                            language === "ar"
                              ? "البريد الإلكتروني"
                              : "Adresse e-mail"
                          }
                          inputType="email"
                          inputName="email"
                          inputPlaceholder={
                            language === "ar"
                              ? "أدخل بريدك الإلكتروني"
                              : "Entrez votre e-mail"
                          }
                          readOnly={!isEditingEmail}
                          setChangevalue={(e) =>
                            setUpdatedEmail(e.target.value)
                          }
                          value={updatedEmail}
                          language={language}
                        />
                        <InputForm
                          labelForm={
                            language === "ar"
                              ? "تأكيد البريد الإلكتروني"
                              : "Confirmer l'adresse e-mail"
                          }
                          inputType="email"
                          inputName="email"
                          inputPlaceholder={
                            language === "ar"
                              ? "تأكيد بريدك الإلكتروني"
                              : "Confirmez votre e-mail"
                          }
                          readOnly={!isEditingEmail}
                          setChangevalue={(e) =>
                            setUpdatedConfirmEmail(e.target.value)
                          }
                          value={updatedConfirmEmail}
                          language={language}
                        />
                      </>
                    )}

                    {/* Show Password Fields Only When Editing Password */}
                    {isEditingEmail === false && (
                      <>
                        <InputFormPassword
                          labelForm={
                            language === "ar"
                              ? "كلمة المرور القديمة"
                              : "Ancien mot de passe"
                          }
                          inputPlaceholder={
                            language === "ar"
                              ? "أدخل كلمة المرور القديمة"
                              : "Entrez votre ancien mot de passe"
                          }
                          inputName="Oldpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) =>
                            setUpdatedOldPassword(e.target.value)
                          }
                          value={updatedOldPassword}
                          language={language}
                        />
                        <InputFormPassword
                          labelForm={
                            language === "ar"
                              ? "كلمة المرور الجديدة"
                              : "Nouveau mot de passe"
                          }
                          inputPlaceholder={
                            language === "ar"
                              ? "أدخل كلمة المرور الجديدة"
                              : "Entrez votre nouveau mot de passe"
                          }
                          inputName="Newpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) =>
                            setUpdatedNewPassword(e.target.value)
                          }
                          value={updatedNewPassword}
                          language={language}
                        />
                        <InputFormPassword
                          labelForm={
                            language === "ar"
                              ? "تأكيد كلمة المرور"
                              : "Confirmer le mot de passe"
                          }
                          inputPlaceholder={
                            language === "ar"
                              ? "تأكيد كلمة المرور الجديدة"
                              : "Confirmez votre mot de passe"
                          }
                          inputName="Cpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) =>
                            setUpdatedConfirmPassword(e.target.value)
                          }
                          value={updatedConfirmPassword}
                          language={language}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {/* {activeTab === "Subscription" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader mb-5 border-b pb-4">
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الاشتراك" : "Abonnement"}
                </h2>
              </div>

              <div className="flex-col settingsRightScroll bg-white rounded-lg">
                {SubscriptionsDataLoading ? (
                  <div className="flex justify-center items-center col-span-3 py-12">
                    <CircularProgress color="inherit" />
                  </div>
                ) : SubscriptionsData?.length > 0 ? (
                  SubscriptionsData?.map((sub) => {
                    const formattedFeatures = {
                      customers: {
                        create: sub.features?.customers?.create || false,
                        read: sub.features?.customers?.read || false,
                        update: sub.features?.customers?.update || false,
                        delete: sub.features?.customers?.delete || false,
                      },
                      vendors: {
                        create: sub.features?.vendors?.create || false,
                        read: sub.features?.vendors?.read || true, // Par défaut à true comme exemple
                        update: sub.features?.vendors?.update || false,
                        delete: sub.features?.vendors?.delete || false,
                      },
                      suppliers: {
                        create: sub.features?.suppliers?.create || false,
                        read: sub.features?.suppliers?.read || true,
                        update: sub.features?.suppliers?.update || false,
                        delete: sub.features?.suppliers?.delete || false,
                      },
                      products: {
                        create: sub.features?.products?.create || false,
                        read: sub.features?.products?.read || true,
                        update: sub.features?.products?.update || false,
                        delete: sub.features?.products?.delete || false,
                      },
                      publicity: {
                        create: sub.features?.publicity?.create || false,
                        read: sub.features?.publicity?.read || false,
                        update: sub.features?.publicity?.update || false,
                        delete: sub.features?.publicity?.delete || false,
                      },
                      stock: {
                        create: sub.features?.stock?.create || false,
                        read: sub.features?.stock?.read || true,
                        update: sub.features?.stock?.update || false,
                        delete: sub.features?.stock?.delete || false,
                      },
                    };

                    return (
                      <div className="settingPersonalInformation grid grid-cols-2 gap-6">
                        <SubscriptionCard
                          key={sub._id}
                          title={sub.name}
                          price={sub.amount}
                          features={formattedFeatures}
                          buttonText={language === "ar" ? "اشترك" : "S'abonner"}
                          onClick={() => {
                            handleOpenModalSubscription(sub._id);
                          }}
                          language={language}
                          popular={
                            sub.popular ||
                            sub.name.toLowerCase().includes("standard")
                          }
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center col-span-3 py-12 text-gray-500">
                    <p
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "لا توجد اشتراكات متاحة"
                        : "Aucun abonnement disponible"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Subscribe Modal */}
      <Modal
        isOpen={openModelSubscibe}
        onRequestClose={handleCloseModalSubscription}
        contentLabel={
          language === "ar"
            ? "إضافة اشتراك جديد"
            : "Ajouter un nouvel abonnement"
        }
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass pb-0">
          <h2
            className="dialogTitle text-xl font-bold mb-4"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إضافة اشتراك جديد"
              : "Ajouter un nouvel abonnement"}
          </h2>
          <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
            <div className="dialogAddCustomerItem">
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "مدة الاشتراك :" : "Durée d'abonnement :"}
              </span>
              <div className="selectStoreWilayaCommune w-[500px]">
                <select
                  name="productCategory"
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  <option value="">
                    {language === "ar"
                      ? "-- اختر المدة --"
                      : "-- Sélectionner la durée --"}
                  </option>
                  <option value="1">
                    {language === "ar" ? "شهر" : "Mois"}
                  </option>
                  <option value="3">
                    {language === "ar" ? "ثلاثة أشهر" : "Trimestre"}
                  </option>
                  <option value="6">
                    {language === "ar" ? "ستة أشهر" : "Semestre"}
                  </option>
                  <option value="12">
                    {language === "ar" ? "سنة" : "Année"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div
            className={`flex justify-end ${
              language === "ar" ? "space-x-reverse" : ""
            } space-x-8 items-start mt-[20px]`}
          >
            {!submitionLoading ? (
              <>
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseModalSubscription}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                  onClick={handleSubmitNewSubscription}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
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

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={openUpdateConfirmationDialog}
        onConfirm={handleClickSave}
        onClose={handleCloseDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد تحديث الملف الشخصي"
            : "Confirmer la mise à jour du profil"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تحديث ملفك الشخصي؟"
            : "Êtes-vous sûr de vouloir mettre à jour votre profil ?"
        }
        language={language}
      />
      <ConfirmDialog
        open={openUpdateEmailPasswordConfirmationDialog}
        onConfirm={handleUpdateEmailPassword}
        onClose={handleCloseDialog}
        dialogTitle={
          isEditingPassword
            ? language === "ar"
              ? "تأكيد تحديث كلمة المرور"
              : "Confirmer la mise à jour du mot de passe"
            : language === "ar"
            ? "تأكيد تحديث البريد الإلكتروني"
            : "Confirmer la mise à jour de l'e-mail"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد تحديث ${
                isEditingPassword ? "كلمة المرور" : "البريد الإلكتروني"
              }؟`
            : `Êtes-vous sûr de vouloir mettre à jour votre ${
                isEditingPassword ? "mot de passe" : "e-mail"
              } ?`
        }
        language={language}
      />

      {/* Add Category Confirmation Dialog */}
      <ConfirmDialog
        open={openAddCategoryConfirmationDialog}
        onConfirm={handleAddCategoriesToStore}
        onClose={handleCloseAddCategoryConfirmationDialog}
        dialogTitle={
          language === "ar"
            ? "تأكيد إضافة الفئة"
            : "Confirmer l'ajout de la catégorie"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد إضافة هذه الفئة إلى متجرك؟"
            : "Êtes-vous sûr de vouloirajouter cette catégorie à votre magasin ?"
        }
        language={language}
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={openAddCategoryModal}
        onRequestClose={false}
        contentLabel={
          language === "ar"
            ? "إضافة فئة متجر جديدة"
            : "Ajouter une nouvelle catégorie"
        }
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!CategoryDataLoading ? (
          <div
            className="customerClass pb-0"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <h2
                className="dialogTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "اختر فئة متجرك"
                  : "Sélectionnez la catégorie de votre magasin"}
              </h2>
            </div>
            {CategoryData.length > 0 ? (
              <div className="dialogAddCustomerItem items-center mb-6">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "فئة المنتج :"
                    : "Catégorie de produit :"}
                </span>
                <div className="selectStoreWilayaCommune w-[500px]">
                  <select
                    name="productCategory"
                    onChange={handleProductCategoryChange}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    <option value="">
                      {language === "ar"
                        ? "-- اختر فئة المنتج --"
                        : "-- Sélectionner une catégorie de produit --"}
                    </option>
                    {CategoryData?.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center p-4 text-gray-500">
                <h1
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "لا توجد بيانات متاحة"
                    : "Aucune donnée disponible"}
                </h1>
              </div>
            )}
            {!submitionLoading ? (
              <div
                className={`flex justify-end ${
                  language === "ar" ? "space-x-reverse" : ""
                } space-x-8 items-start mt-[20px]`}
              >
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseAddCategoryModal}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
                  onClick={handleOpenAddCategoryConfirmationDialog}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[60px] mt-2">
                <CircularProgress color="inherit" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <CircularProgress color="inherit" />
          </div>
        )}
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
