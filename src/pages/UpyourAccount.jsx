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

export default function UpYourAccount() {
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
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
      </div>
      <div className="signUpContainer w-full flex items-center justify-center">
        <div className="signUpContainerRight w-[60%] h-full border-r-2 border-[#C9E4EE]">
          <div className="signUpContainerRightContainer">
            <h2 className="titleText">
              Let’s set up your <br />
              Account.
            </h2>
            <div className="logInForm mt-0">
              <div className="flex space-x-8">
                <InputForm
                  labelForm="First Name"
                  inputType="text"
                  inputPlaceholder="Your first name"
                  inputName="firstName"
                  setChangevalue={handleFirstNameChange}
                  value={FirstName}
                />
                <InputForm
                  labelForm="Last Name"
                  inputType="text"
                  inputPlaceholder="Your last name"
                  inputName="lastName"
                  setChangevalue={handleLastNameChange}
                  value={LastName}
                />
              </div>
              <div className="flex space-x-8">
                <InputForm
                  labelForm="Password"
                  inputType="password"
                  inputPlaceholder="Your password"
                  inputName="Password"
                  setChangevalue={handlePasswordChange}
                  value={Password}
                />
                <InputForm
                  labelForm="Confirm password"
                  inputType="password"
                  inputPlaceholder="Confirm your password"
                  inputName="ConfirmPassword"
                  setChangevalue={handleConfirmPasswordChange}
                  value={ConfirmPassword}
                />
              </div>
              <div className="flex space-x-8">
                <InputForm
                  labelForm="Store Name"
                  inputType="text"
                  inputPlaceholder="Your Store Name"
                  inputName="storeName"
                  setChangevalue={handleStoreNameChange}
                  value={StoreName}
                />
                <InputForm
                  labelForm="Address "
                  inputType="text"
                  inputPlaceholder="Your address"
                  inputName="storeAddress"
                  setChangevalue={handleAddressChange}
                  value={Address}
                />
              </div>
              <div className="flex space-x-8">
                <InputForm
                  labelForm="Commercial register number"
                  inputType="number"
                  inputPlaceholder="Your commercial register number"
                  inputName="RC"
                  setChangevalue={handleR_CommerceChange}
                  value={R_Commerce}
                />
              </div>
              <div className="flex space-x-8">
                <div className="flex-col space-y-[12px] items-center">
                  <span>Wilaya</span>
                  <div className="selectStoreWilayaCommune w-[400px]">
                    <select
                      name="storeWilaya"
                      value={selectedWilaya}
                      onChange={handleWilayaChange}
                    >
                      <option value="">Select Wilaya</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya.value} value={wilaya.value}>
                          {wilaya.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-col space-y-[12px] items-center">
                  <span>Commune</span>
                  <div className="selectStoreWilayaCommune w-[400px]">
                    <select
                      name="storeCommune"
                      value={selectedCommune}
                      onChange={handleCommuneChange}
                    >
                      <option value="">Select Commune</option>
                      {communes.map((commune) => (
                        <option key={commune.value} value={commune.value}>
                          {commune.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex-col space-y-[12px]">
                <span>Store Category</span>
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
                className="buttonAdd buttonBorder"
                onClick={handleAddCategoryClick}
                type="button"
              >
                <PlusIcon className="iconAsideBar" />
                <span className="buttonTextLight">Add Store Category</span>
              </button>
              <ButtonDark
                buttonSpan="Continue"
                setOnClick={handleUpdateStore}
              />
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex justify-center items-center imageBorder">
          <img className="h-[90%]" src={UpAccountImage} alt="Up Account" />
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
          <div className="customerClass">
            {errorInDialog && (
              <Alert severity="error" onClose={() => setErrorInDialog(false)}>
                Please select at least one category.
              </Alert>
            )}
            <h2 className="customerClassTitle">Select your Store Category</h2>

            <div className="storyCategoryClass">
              {CategoryData.length > 0 ? (
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
                <div>
                  <h1>no data is availble</h1>
                </div>
              )}
            </div>
            {
              <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
                <button
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={handleSaveCategories}
                >
                  Save
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
        dialogTitle="Confirm Deletion"
        dialogContentText={`Are you sure you want to delete the category "${categoryToDelete?.name}"?`}
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
