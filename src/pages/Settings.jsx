import React, { useState, useEffect } from "react";
import {
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/16/solid";
import InputForm from "../components/InputForm";
import { wilayasAndCommunes } from "../util/WilayaCommunesData";
import ButtonDelete from "../components/ButtonDelete";
import ButtonSave from "../components/ButtonSave";
import { useLocation, useParams } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ConfirmDialog from "../components/ConfirmDialog";
import ButtonModify from "../components/ButtonModify";

export default function Settings() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const location = useLocation();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleOpenConfirmationDialog = () => setOpenConfirmationDialog(true);
  const handleCloseDialog = () => setOpenConfirmationDialog(false);

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

  //---------------------------------API calls---------------------------------\\
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

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    wilaya: "",
    commune: "",
    storeAddress: "",
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
      });
    }
  }, [CustomerData]);

  const handleClickModify = () => setIsEditing(true);

  const handleClickSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/Store/${decodedToken.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(editableData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error updating customer data: ${errorData.message}`);
      }

      // Successfully saved
      setIsEditing(false);
      refetchCustomerDataData();
    } catch (error) {
      console.error(error);
    }
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

  const TakeMeToGoogleMaps = async (val) => {
    alert(val);
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
                      <ButtonSave setOnClick={handleClickSave} />
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
                        readOnly={!isEditing}
                      />
                      <InputForm
                        labelForm="Phone Number"
                        inputType="text"
                        inputName="phoneNumber"
                        value={editableData.phoneNumber}
                        setChangevalue={handleInputChange}
                        readOnly={!isEditing}
                      />
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
                              TakeMeToGoogleMaps(CustomerData?.storeLocation)
                            }
                          />
                        </div>
                      </div>
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
    </div>
  );
}
