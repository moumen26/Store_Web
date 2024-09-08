import React, { useRef, useState } from "react";
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
import MapIcon from '@mui/icons-material/Map';
import ConfirmDialog from "../components/ConfirmDialog";

export default function Settings() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const location = useLocation();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const [activeTab, setActiveTab] = useState("PersoInf");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
    setSelectedCommune("");
  };
  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
  };

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
      if (errorData.error.statusCode == 404) return {};
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

  const handleClickSave = async () => {
    alert('save')
  }
  const handleConfirmDeleteAccount = async () => {
    alert('delete')
  }
  const TakeMeToGoogleMaps = async (val) => {
    alert(val)
  }
  
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
                <ButtonSave setOnClick={handleClickSave}/>
              </div>
              {!CustomerDataLoading ?
                <div className="flex-col settingsRightScroll">
                  <div>
                      <div className="settingPersonalInformation">
                        <InputForm
                          labelForm="First Name"
                          inputType="text"
                          inputName="firstName"
                          value={CustomerData?.firstName}
                          readOnly={true}
                        />
                        <InputForm
                          labelForm="Last Name"
                          inputType="text"
                          inputName="LastName"
                          value={CustomerData?.lastName}
                          readOnly={true}
                        />
                        <InputForm
                          labelForm="Email Address"
                          inputType="email"
                          inputName="emailAddress"
                          value={CustomerData?.email}
                          readOnly={true}
                        />
                        <InputForm
                          labelForm="Phone Number"
                          inputType="phone"
                          inputName="phoneNumber"
                          value={CustomerData?.phoneNumber}
                          readOnly={true}
                        />
                        <InputForm
                          labelForm="Wilaya"
                          inputType="text"
                          inputName="Wilaya"
                          value={CustomerData?.wilaya}
                          readOnly={true}
                        />
                        <InputForm
                          labelForm="Commune"
                          inputType="text"
                          inputName="Commune"
                          value={CustomerData?.commune}
                          readOnly={true}
                        />
                        <div className="inputItem">
                          <span>Address</span>
                          <div className="inputForm">
                            <input 
                              type="text" 
                              name="address"
                              value={CustomerData?.storeAddress}
                              readOnly
                            />
                            <MapIcon onClick={() => TakeMeToGoogleMaps(CustomerData?.storeLocation)}/>
                          </div>
                        </div>
                        {/* 
                          <div className="inputItem">
                            <span>Wilaya</span>
                            <select
                              className="selectOptionWilaya"
                              name="selectOptionWilaya"
                              id="selectOptionWilaya"
                              value={selectedWilaya}
                              onChange={handleWilayaChange}
                            >
                              <option value="" disabled>
                                -- Select Commune -- 
                              </option>
                              {sortedWilayaCodes.map((wilayaCode) => (
                                <option key={wilayaCode} value={wilayaCode}>
                                  {wilayasAndCommunes[wilayaCode].name}{" "}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="inputItem">
                            <span>Commune</span>
                            <select
                              className="selectOptionWilaya"
                              name="selectOptionCommune"
                              id="selectOptionCommune"
                              value={selectedCommune}
                              onChange={handleCommuneChange}
                              disabled={!selectedWilaya}
                            >
                              <option value="" disabled>
                                -- Select Commune --  
                              </option>
                              {selectedWilaya &&
                                wilayasAndCommunes[selectedWilaya]?.communes?.map(
                                  (commune, index) => (
                                    <option key={index} value={commune}>
                                      {commune}
                                    </option>
                                  )
                                )}
                            </select>
                          </div> 
                        */}
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
                      Labore assumenda, nisi asperiores officiis ex iusto at, quae
                      aspernatur odio corporis, itaque facere officia totam ullam
                      blanditiis nostrum nihil enim minima.
                    </p>
                    <p className="uploadSpan">
                      There is no reversing this action.
                    </p>
                    <ButtonDelete setOnClick={handleOpenConfirmationDialog}/>
                  </div>
                </div>
              :
                <div className="w-full h-full flex items-center justify-center">
                  <CircularProgress color="inherit" />
                </div>
              }
            </div>
          )}
          {activeTab === "EmailPass" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Email & Paasword</h2>
              </div>
            </div>
          )}
          {!activeTab && <div>Please select an option</div>}
        </div>
      </div>

      <ConfirmDialog
        open={openConfirmationDialog}
        onConfirm={handleConfirmDeleteAccount}
        onClose={handleCloseDialog}
        dialogTitle="Confirm the deletion of your account"
        dialogContentText={`Are you sure you want to delete your account?`}
      />
    </div>
  );
}
