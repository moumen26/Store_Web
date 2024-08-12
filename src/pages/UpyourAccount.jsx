import React, { useState, useEffect } from "react";
import UpAccountImage from "../assets/images/UpAccount.png";
import InputForm from "../components/InputForm";
import Dialog from "@mui/material/Dialog";
import ButtonDark from "../components/ButtonDark";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "../components/ConfirmDialog";

export default function UpYourAccount() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dialogSelectedCategories, setDialogSelectedCategories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errorInDialog, setErrorInDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryAdded, setCategoryAdded] = useState(false);

  useEffect(() => {
    if (openDialog) {
      setDialogSelectedCategories(selectedCategories);
      setErrorInDialog(false);
    }
  }, [openDialog, selectedCategories]);

  useEffect(() => {
    if (categoryAdded) {
      setSnackbarMessage(
        `Successfully added categories: ${dialogSelectedCategories.join(", ")}`
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setCategoryAdded(false);
    }
  }, [categoryAdded]);

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
    if (dialogSelectedCategories.length === 0) {
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
    setSnackbarMessage(`Category '${categoryToDelete}' deleted.`);
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    setCategoryToDelete(null);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const wilayas = [
    { value: "", label: "-- Select Store Wilaya --" },
    { value: "wilaya1", label: "Wilaya 1" },
    { value: "wilaya2", label: "Wilaya 2" },
  ];

  const communes = [
    { value: "", label: "-- Select Store Commune --" },
    { value: "commune1", label: "Commune 1" },
    { value: "commune2", label: "Commune 2" },
  ];

  const categories = ["Alimentation", "Detergent", "Emballage"];

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
              <form>
                <div className="flex space-x-8">
                  <InputForm
                    labelForm="First Name"
                    inputType="text"
                    inputPlaceholder="Your first name"
                    inputName="firstName"
                  />
                  <InputForm
                    labelForm="Last Name"
                    inputType="text"
                    inputPlaceholder="Your last name"
                    inputName="lastName"
                  />
                </div>
                <div className="flex space-x-8">
                  <InputForm
                    labelForm="Store Name"
                    inputType="text"
                    inputPlaceholder="Your Store Name"
                    inputName="storeName"
                  />
                  <InputForm
                    labelForm="Address "
                    inputType="text"
                    inputPlaceholder="Your address"
                    inputName="storeAddress"
                  />
                </div>
                <div className="flex space-x-8">
                  <div className="flex-col space-y-[12px] items-center">
                    <span>Wilaya</span>
                    <div className="selectStoreWilayaCommune w-[400px]">
                      <select name="storeWilaya">
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
                      <select name="storeCommune">
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
                        <span>{category}</span>
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
                <ButtonDark buttonSpan="Continue" />
              </form>
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex justify-center items-center imageBorder">
          <img className="h-[90%]" src={UpAccountImage} alt="Up Account" />
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <div className="dialogAdd">
          {errorInDialog && (
            <Alert severity="error" onClose={() => setErrorInDialog(false)}>
              Please select at least one category.
            </Alert>
          )}
          <div className="flex items-center space-x-3 title title">
            <h2 className="dialogTitle">Select your Store Category</h2>
          </div>
          <div className="storyCategoryClass">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`storyCategoryItem ${
                  dialogSelectedCategories.includes(category) ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category}</span>
              </div>
            ))}
          </div>
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
        </div>
      </Dialog>
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        dialogTitle="Confirm Deletion"
        dialogContentText={`Are you sure you want to delete the category "${categoryToDelete}"?`}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
