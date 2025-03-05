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

export default function Settings() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [
    openConfirmationDeleteCategoryDialog,
    setOpenConfirmationDeleteCategoryDialog,
  ] = useState(false);
  const handleOpenConfirmationDialog = () => setOpenConfirmationDialog(true);

  const [openUpdateConfirmationDialog, setOpenUpdateConfirmationDialog] = useState(false);
  const handleOpenUpdateConfirmationDialog = () => setOpenUpdateConfirmationDialog(true);
  
  const [openUpdateEmailPasswordConfirmationDialog, setOpenUpdateEmailPasswordConfirmationDialog] = useState(false);
  const handleOpenUpdateEmailPasswordConfirmationDialog = () => setOpenUpdateEmailPasswordConfirmationDialog(true);
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
      if(isEditingPassword) {
        setSubmitionLoading(true);
        if(updatedNewPassword != updatedConfirmPassword) {
          setAlertType(true);
          setSnackbarMessage("Passwords do not match");
          setSnackbarOpen(true);
          setSubmitionLoading(false);
          return;
        }
        response = await axios.patch(
          import.meta.env.VITE_APP_URL_BASE + `/Auth/updateStorePassword/${decodedToken.id}`,
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
      } else if(isEditingEmail) {
        setSubmitionLoading(true);
        if(updatedEmail != updatedConfirmEmail) {
          setAlertType(true);
          setSnackbarMessage("Emails do not match");
          setSnackbarOpen(true);
          setSubmitionLoading(false);
          return;
        }
        response = await axios.patch(
          import.meta.env.VITE_APP_URL_BASE + `/Auth/updateStoreEmail/${decodedToken.id}`,
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
        setUpdatedEmail('')
        setUpdatedConfirmEmail('')
        setUpdatedNewPassword('')
        setUpdatedConfirmPassword('')
        setUpdatedOldPassword('')
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
    <div className="pagesContainer settingsContainer">
      <div className="pageTable h-[100vh] flex-row">
        <div className="settingsLeft flex-col space-y-[32px]">
          <Link
            to="/dashboard"
            className="relative flex items-center space-x-2 text-gray-700 font-semibold transition-all duration-300"
          >
            <span className="relative flex items-center space-x-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full">
              <ArrowLongLeftIcon className="w-5 h-5 text-gray-600" />
              <span>Back to Dashboard</span>
            </span>
          </Link>

          <h2 className="pagesTitle">User profile management</h2>
          <div
            className={`flex-col settingsBar space-y-7 ${
              activeTab === "PersoInf" || activeTab === "EmailPass"
                ? "AllTransparent"
                : ""
            }`}
          >
            <div
              className={`flex items-center settingItem cursor-pointer ${
                activeTab === "PersoInf" ? "settingItemToggle" : ""
              }`}
              onClick={() => handleTabClick("PersoInf")}
            >
              <UserIcon className="iconAsideBar" />
              <span className="ml-3">Personal Information</span>
            </div>
            <div
              className={`flex items-center settingItem cursor-pointer ${
                activeTab === "EmailPass" ? "settingItemToggle" : ""
              }`}
              onClick={() => handleTabClick("EmailPass")}
            >
              <ShieldCheckIcon className="iconAsideBar" />
              <span className="ml-3">Email & Password</span>
            </div>
            <div
              className={`flex items-center settingItem cursor-pointer ${
                activeTab === "Subscription" ? "settingItemToggle" : ""
              }`}
              onClick={() => handleTabClick("Subscription")}
            >
              <CalendarDateRangeIcon className="iconAsideBar" />
              <span className="ml-3">Subscription</span>
            </div>
          </div>
        </div>
        <div className="settingsRight">
          {activeTab === "PersoInf" && (
            <div className="flex-col settingsRightContainer">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Personal information</h2>
                <div className="flex space-x-4">
                  {isEditing ? (
                    <div className="flex space-x-4">
                      <ButtonModify
                        buttonSpan="Cancel"
                        showIcon={false}
                        onClick={handleClickCancel}
                      />
                      <ButtonSave
                        setOnClick={handleOpenUpdateConfirmationDialog}
                      />
                    </div>
                  ) : (
                    <ButtonModify
                      buttonSpan="Modify"
                      onClick={handleClickModify}
                    />
                  )}
                </div>
              </div>
              {!CustomerDataLoading ? (
                <div className="flex-col settingsRightScroll">
                  <div>
                    <div className="settingPersonalInformation">
                      <InputForm
                        labelForm="Email"
                        inputType="email"
                        inputName="email"
                        value={editableData.email}
                        readOnly={true}
                      />
                      <InputForm
                        labelForm="Phone number"
                        inputType="phone"
                        inputName="phone"
                        value={editableData.phoneNumber}
                        inputPlaceholder={"Not available"}
                        readOnly={true}
                      />
                      <InputForm
                        labelForm="Store Name"
                        inputType="text"
                        inputName="storeName"
                        value={editableData.storeName}
                        setChangevalue={handleInputChange}
                        readOnly={!isEditing}
                      />
                      <InputForm
                        labelForm="First Name"
                        inputType="text"
                        inputName="firstName"
                        value={editableData.firstName}
                        setChangevalue={handleInputChange}
                        readOnly={!isEditing}
                      />
                      <InputForm
                        labelForm="Last Name"
                        inputType="text"
                        inputName="lastName"
                        value={editableData.lastName}
                        setChangevalue={handleInputChange}
                        readOnly={!isEditing}
                      />
                      <div className="inputItem">
                        <span>Address</span>
                        <div className="inputForm">
                          <input
                            type="text"
                            name="storeAddress"
                            value={editableData.storeAddress}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                          />
                          <MapIcon
                            onClick={() =>
                              TakeMeToGoogleMaps(editableData.storeAddress)
                            }
                          />
                        </div>
                      </div>
                      {isEditing ? (
                        <>
                          <div className="flex-col space-y-[12px] items-center">
                            <span>Wilaya</span>
                            <div className="selectStoreWilayaCommune w-[400px]">
                              <select
                                name="wilaya"
                                value={editableData.wilaya}
                                onChange={handleInputChange} // Corrected to onChange
                                disabled={!isEditing}
                              >
                                <option value="">Select Wilaya</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex-col space-y-[12px] items-center">
                            <span>Commune</span>
                            <div className="selectStoreWilayaCommune w-[400px]">
                              <select
                                name="commune"
                                value={editableData.commune}
                                onChange={handleInputChange} // Corrected to onChange
                                disabled={!isEditing}
                              >
                                <option value="">Select Commune</option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <InputForm
                            labelForm="Wilaya"
                            inputType="text"
                            inputName="wilaya"
                            value={editableData.wilaya}
                            setChangevalue={handleInputChange}
                            readOnly={!isEditing}
                          />
                          <InputForm
                            labelForm="Commune"
                            inputType="text"
                            inputName="commune"
                            value={editableData.commune}
                            setChangevalue={handleInputChange}
                            readOnly={!isEditing}
                          />
                        </>
                      )}
                      {!CategoryDataByStoreLoading ? (
                        <div className="flex-col space-y-[12px]">
                          <span>Store Category</span>
                          <div className="flex space-x-4 items-center">
                            <div className="selectedCategories">
                              {CategoryDataByStore?.map((category, index) => (
                                <div key={index} className="categoryChip">
                                  <span>{category.name}</span>
                                </div>
                              ))}
                            </div>
                            <PlusCircleIcon
                              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
                              onClick={handleOpenAddCategoryModal}
                            />
                            <Modal
                              isOpen={openAddCategoryModal}
                              onRequestClose={false}
                              contentLabel="Add new Store Category"
                              className="addNewModal"
                              style={{
                                overlay: {
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  zIndex: 1000,
                                },
                              }}
                            >
                              {!CategoryDataLoading ? (
                                <div className="customerClass p-0">
                                  <div className="flex items-center space-x-3">
                                    <h2 className="customerClassTitle">
                                      Select your Store Category
                                    </h2>
                                  </div>
                                  {CategoryData.length > 0 ? (
                                    <div className="dialogAddCustomerItem items-center">
                                      <span>Product Category :</span>
                                      <div className="selectStoreWilayaCommune w-[500px]">
                                        <select
                                          name="productCategory"
                                          onChange={handleProductCategoryChange}
                                        >
                                          <option value="">
                                            -- Select Product Category --
                                          </option>
                                          {CategoryData?.map((category) => (
                                            <option
                                              key={category._id}
                                              value={category._id}
                                            >
                                              {category.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <h1>no data is availble</h1>
                                    </div>
                                  )}
                                  {!submitionLoading ? (
                                    <div className="flex justify-end space-x-8 items-start mt-[20px]">
                                      <button
                                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                                        onClick={handleCloseAddCategoryModal}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                                        onClick={
                                          handleOpenAddCategoryConfirmationDialog
                                        }
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center space-x-8 pr-8 h-[60px] mt-2">
                                      <CircularProgress color="inherit" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center space-x-8 pr-8 h-[60px] mt-2">
                                  <CircularProgress color="inherit" />
                                </div>
                              )}
                            </Modal>
                            <ConfirmDialog
                              open={openAddCategoryConfirmationDialog}
                              onClose={handleCloseAddCategoryConfirmationDialog}
                              onConfirm={handleAddCategoriesToStore}
                              dialogTitle="Confirm the addition of the category"
                              dialogContentText={`Are you sure you want to add this category to your store?`}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <CircularProgress color="inherit" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="deleteContainer flex-col space-y-3">
                    <span className="deleteSpan">Delete Account</span>
                    <div className="bg-white w-full p-3 rounded-m flex space-x-2">
                      <ShieldExclamationIcon className="iconAsideBar" />
                      <p className="uploadSpan">
                        After making a deletion request, you will have
                        <span className="uploadSpanMedium"> "6 months"</span> to
                        maintain this account.
                      </p>
                    </div>
                    <p className="uploadSpan">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Labore assumenda, nisi asperiores officiis ex iusto at,
                      quae aspernatur odio corporis, itaque facere officia totam
                      ullam blanditiis nostrum nihil enim minima.
                    </p>
                    <p className="uploadSpan">
                      There is no reversing this action.
                    </p>
                    <ButtonDelete setOnClick={handleOpenConfirmationDialog} />
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
                dialogTitle="Confirm the deletion of your account"
                dialogContentText={`Are you sure you want to delete your account?`}
              />
            </div>
          )}
          {activeTab === "EmailPass" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Email & Password</h2>
                <div className="flex space-x-4">
                  {isEditingEmail || isEditingPassword ? (
                    <div className="flex space-x-4">
                      <ButtonModify
                        buttonSpan="Cancel"
                        showIcon={false}
                        onClick={handleCancel}
                      />
                      <ButtonSave 
                        setOnClick={handleOpenUpdateEmailPasswordConfirmationDialog}
                      />
                    </div>
                  ) : (
                    <>
                      <ButtonModify
                        buttonSpan="Modify"
                        onClick={handleClickModifyMenu}
                      />
                      <Menu
                        anchorEl={showModifyMenu}
                        open={Boolean(showModifyMenu)}
                        onClose={handleCloseModifyMenu}
                      >
                        <MenuItem onClick={handleModifyEmail}>
                          <span>Modify Email</span>
                        </MenuItem>
                        <MenuItem onClick={handleModifyPassword}>
                          <span>Modify Password</span>
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-col settingsRightScroll">
                <div>
                  <div className="settingPersonalInformation">
                    {/* Show Email Fields Only When Editing Email */}
                    {isEditingPassword === false && (
                      <>
                        <InputForm
                          labelForm="Email Address"
                          inputType="email"
                          inputName="email"
                          inputPlaceholder="Enter your Email"
                          readOnly={!isEditingEmail}
                          setChangevalue={(e) => setUpdatedEmail(e.target.value)}
                          value={updatedEmail}
                        />
                        <InputForm
                          labelForm="Confirm Email Address"
                          inputType="email"
                          inputName="email"
                          inputPlaceholder="Confirm your Email"
                          readOnly={!isEditingEmail}
                          setChangevalue={(e) => setUpdatedConfirmEmail(e.target.value)}
                          value={updatedConfirmEmail}
                        />
                      </>
                    )}
                    {/* Show Password Fields Only When Editing Password */}
                    {isEditingEmail === false && (
                      <>
                        <InputFormPassword
                          labelForm="Old password"
                          inputPlaceholder="Enter your old password"
                          inputName="Oldpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) => setUpdatedOldPassword(e.target.value)}
                          value={updatedOldPassword}
                        />
                        <InputFormPassword
                          labelForm="New password"
                          inputPlaceholder="Enter your new password"
                          inputName="Newpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) => setUpdatedNewPassword(e.target.value)}
                          value={updatedNewPassword}
                        />
                        <InputFormPassword
                          labelForm="Confirm password"
                          inputPlaceholder="Confirm your password"
                          inputName="Cpassword"
                          readOnly={!isEditingPassword}
                          setChangevalue={(e) => setUpdatedConfirmPassword(e.target.value)}
                          value={updatedConfirmPassword}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Subscription" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Subscription</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SubscriptionsDataLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress color="inherit" />
                  </div>
                ) : SubscriptionsData?.length > 0 ? (
                  SubscriptionsData?.map((sub) => (
                    <SubscriptionCard
                      key={sub._id}
                      title={sub.name}
                      price={sub.amount}
                      features={[]}
                      buttonText="Subscribe"
                      onClick={() => {
                        handleOpenModalSubscription(sub._id);
                      }}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <p>No subscriptions available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openModelSubscibe}
        onRequestClose={handleCloseModalSubscription}
        contentLabel="Add new Subscription"
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass pb-0">
          <h2 className="dialogTitle">Add New Subscription</h2>
          <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
            <div className="dialogAddCustomerItem">
              <span>Expiry Months :</span>
              <div className="selectStoreWilayaCommune w-[500px]">
                <select
                  name="productCategory"
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">-- Select Duration --</option>
                  <option value="1">Month</option>
                  <option value="3">Trimester</option>
                  <option value="6">Semester</option>
                  <option value="12">Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-8 items-start mt-[20px]">
            {!submitionLoading ? (
              <>
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseModalSubscription}
                >
                  Cancel
                </button>
                <button
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={handleSubmitNewSubscription}
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
      <ConfirmDialog
        open={openUpdateConfirmationDialog}
        onConfirm={handleClickSave}
        onClose={handleCloseDialog}
        dialogTitle="Confirm profile update"
        dialogContentText={`Are you sure you want to update your profile?`}
      />
      <ConfirmDialog
        open={openUpdateEmailPasswordConfirmationDialog}
        onConfirm={handleUpdateEmailPassword}
        onClose={handleCloseDialog}
        dialogTitle={isEditingPassword ? "Confirm password update" : "Confirm email update"}
        dialogContentText={`Are you sure you want to update your ${isEditingPassword ? "password" : "email"}?`}
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
