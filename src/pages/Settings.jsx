import React, { useState, useEffect } from "react";
import {
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
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
import { useLocation, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ConfirmDialog from "../components/ConfirmDialog";
import ButtonModify from "../components/ButtonModify";
import axios from "axios";
import Modal from "react-modal";

export default function Settings() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
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

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
    setOpenUpdateConfirmationDialog(false);
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

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
    setSelectedCommune("");
  };
  const handleCommuneChange = (e) => setSelectedCommune(e.target.value);

  const sortedWilayaCodes = Object.keys(wilayasAndCommunes).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    wilaya: "",
    commune: "",
    storeAddress: "",
    storeName: "",
    storeLocation: "",
    RC: "",
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

  const [openAddCategoryConfirmationDialog, setOpenAddCategoryConfirmationDialog] = useState(false);
  const handleOpenAddCategoryConfirmationDialog = () => {
    setOpenAddCategoryConfirmationDialog(true);
  };
  const handleCloseAddCategoryConfirmationDialog = () => {
    setOpenAddCategoryConfirmationDialog(false);
  }

  const TakeMeToGoogleMaps = async (val) => {
    alert(val);
  };

  const [selectedCategorie , setSelectedCategorie] = useState("")
  const handleProductCategoryChange = (e) => {
    setSelectedCategorie(e.target.value)
  }


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
    queryKey: ["CustomerData", user?.token, location.key, id],
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
    queryKey: ["CategoryData", user?.token, location.key, id],
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
    queryKey: ["CategoryDataByStore", user?.token, location.key, id],
    queryFn: fetchCategoryDataByStore,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
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
        import.meta.env.VITE_APP_URL_BASE + `/Category/store/add/${decodedToken.id}`,
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

  return (
    <div className="pagesContainer settingsContainer">
      <div className="pageTable h-[100vh] flex-row">
        <div className="settingsLeft flex-col space-y-[32px]">
          <h2 className="pagesTitle">User profile management</h2>
          <div
            className={`flex-col space-y-7 ${
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
              <span className="ml-3">Personal Info</span>
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
                      <InputForm
                        labelForm="Email Address"
                        inputType="email"
                        inputName="email"
                        value={editableData.email}
                        setChangevalue={handleInputChange}
                        readOnly={true}
                      />
                      <InputForm
                        labelForm="Phone Number"
                        inputType="text"
                        inputName="phoneNumber"
                        value={editableData.phoneNumber}
                        setChangevalue={handleInputChange}
                        readOnly={true}
                      />
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
                      {!CategoryDataByStoreLoading ? (
                        <div className="flex-col space-y-[12px]">
                          <span>Store Category</span>
                          <div className="flex space-x-4 items-center">
                            <div className="selectedCategories">
                              {CategoryDataByStore?.map((category, index) => (
                                <div
                                  key={index}
                                  className="categoryChip"
                                >
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
                              style={{
                                overlay: {
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  zIndex: 1000,
                                },
                                content: {
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "20px",
                                  width: "fit-content",
                                  maxWidth: "40%",
                                  margin: "auto",
                                  height: "70%",
                                  zIndex: 1001,
                                  overflowY: "auto",
                                },
                              }}
                            >
                              {!CategoryDataLoading ? (
                                <div className="customerClass">
                                  <div className="flex items-center space-x-3 title title">
                                    <h2 className="customerClassTitle">
                                      Select your Store Category
                                    </h2>
                                  </div>
                                  <div className="storyCategoryClass">
                                    {CategoryData.length > 0 ? (
                                      <div className="dialogAddCustomerItem items-center">
                                        <span>Product Category :</span>
                                        <div className="selectStoreWilayaCommune w-[500px]">
                                          <select
                                            name="productCategory"
                                            onChange={handleProductCategoryChange}
                                          >
                                            <option value="">-- Select Product Category --</option>
                                            {CategoryData?.map((category) => (
                                              <option key={category._id} value={category._id}>
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
                                  </div>
                                  {!submitionLoading ? (
                                      <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
                                        <button
                                          className="text-gray-500 cursor-pointer hover:text-gray-700"
                                          onClick={handleCloseAddCategoryModal}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                                          onClick={handleOpenAddCategoryConfirmationDialog}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center space-x-8 pr-8 h-[60px] mt-2">
                                        <CircularProgress />
                                      </div>
                                    )
                                  }
                                </div>

                              ) : (
                                <div className="flex items-center justify-center space-x-8 pr-8 h-[60px] mt-2">
                                  <CircularProgress />
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
                          <CircularProgress />
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
                  <CircularProgress />
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
                <h2 className="pagesTitle">Email & Paasword</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={openUpdateConfirmationDialog}
        onConfirm={handleClickSave}
        onClose={handleCloseDialog}
        dialogTitle="Confirm profile update"
        dialogContentText={`Are you sure you want to update your profile?`}
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
