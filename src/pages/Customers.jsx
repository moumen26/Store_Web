import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import CustomerTable from "../components/CustomerTable";
import ButtonExportExel from "../components/ButtonExportExel";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { CircularProgress, Snackbar } from "@mui/material";
import Modal from "react-modal";

import { useLocation } from "react-router-dom";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Customers({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerFirstName: "",
    customerLastName: "",
    storeAddress: "",
    customerPhone: "",
    storeWilaya: "",
    storeCommune: "",
    customerPhoto: null,
    isVendor: false,
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  //form
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RC, setRC] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
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
  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
  };
  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
  };
  const handleRCChange = (e) => {
    setRC(e.target.value);
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
    setSelectedWilaya(null);
    setSelectedCommune(null);
    setRC("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCustomerClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //---------------------------------API calls---------------------------------\\

  //fetch data
  const fetchCustomersData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/MyStores/users/${decodedToken.id}`,
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: CustomersData,
    error: CustomersDataError,
    isLoading: CustomersDataLoading,
    refetch: refetchCustomersData,
  } = useQuery({
    queryKey: ["CustomersData", user?.token, location.key],
    queryFn: fetchCustomersData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  // fetching Cities data
  const fetchCitiesData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Cities/fr`,
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
    queryKey: ["CitiesData", user?.token, location.key],
    queryFn: fetchCitiesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
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
    refetchCustomersData();
    CitiesRefetch();
  };

  //save Fournisseur API
  const handleSaveCustomer = async () => {
    if (Password !== ConfirmPassword) {
      setAlertType(true);
      setSnackbarMessage("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/auth/createNewClient/${decodedToken.id}`,
        {
          FirstName: FirstName,
          LastName: LastName,
          PhoneNumber: Phone,
          Address: Address,
          Wilaya: selectedWilaya,
          Commune: selectedCommune,
          Email: Email,
          Password: Password,
          RC: RC,
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
        handleRefetchDataChange();
        setSubmitionLoading(false);
        handleCloseDialog();
        clearForm();
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
        console.error("Error creating new customer: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating new customer");
      }
    }
  };

  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      {" "}
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
            {language === "ar" ? "العملاء" : "Clients"}
          </h2>
          <div className="buttonTop">
            <ButtonAdd
              buttonSpan={
                language === "ar"
                  ? "إضافة عميل جديد"
                  : "Ajouter un nouveau client"
              }
              onClick={handleAddCustomerClick}
              language={language}
            />
          </div>
        </div>
      </div>
      <div
        className="pageTable"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق العميل..."
                : "Rechercher par client..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={language === "ar" ? "العملاء" : "Clients"}
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <CustomerTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            data={CustomersData}
            dataLoading={CustomersDataLoading}
            language={language}
          />
        </div>
      </div>
      <Modal
        isOpen={openDialog}
        onRequestClose={handleCloseDialog}
        contentLabel={
          language === "ar" ? "إضافة عميل جديد" : "Ajouter un nouveau client"
        }
        className="addNewModal addNewCustomerModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!submitionLoading ? (
          <div
            className="customerClass pb-0"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <h2
              className="dialogTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "إضافة عميل جديد"
                : "Ajouter un nouveau client"}
            </h2>
            <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الاسم الأول" : "Prénom"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="text"
                    name="customerFirstName"
                    value={FirstName}
                    onChange={handleFirstNameChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الاسم الأخير" : "Nom"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="text"
                    name="customerLastName"
                    value={LastName}
                    onChange={handleLastNameChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "العنوان" : "Adresse"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="text"
                    name="storeAddress"
                    value={Address}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="phone"
                    name="customerPhone"
                    value={Phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="email"
                    name="storeAddress"
                    value={Email}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "رقم السجل التجاري"
                    : "Numéro de registre de commerce"}
                </span>
                <div className="inputForm md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="text"
                    name="rc"
                    value={RC}
                    onChange={handleRCChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "كلمة المرور" : "Mot de passe"}
                </span>
                <div className="inputForm relative md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={Password}
                    onChange={handlePasswordChange}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  className="md:w-48"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "تأكيد كلمة المرور"
                    : "Confirmer le mot de passe"}
                </span>
                <div className="inputForm relative md:w-96">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type={showConfirmPassword ? "text" : "password"}
                    name="ConfirmPassword"
                    value={ConfirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الولاية" : "Wilaya"}
                </span>
                <div className="selectStoreWilayaCommune w-full md:w-96">
                  <select
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    name="fournisseurWilaya"
                    value={selectedWilaya}
                    onChange={handleWilayaChange}
                  >
                    <option value="" disabled selected>
                      {language === "ar"
                        ? "اختر الولاية"
                        : "Sélectionner Wilaya"}
                    </option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.value} value={wilaya.value}>
                        {wilaya.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "البلدية" : "Commune"}
                </span>
                <div className="selectStoreWilayaCommune w-full md:w-96">
                  <select
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    name="fournisseurCommune"
                    value={selectedCommune}
                    onChange={handleCommuneChange}
                  >
                    <option value="" disabled selected>
                      {language === "ar"
                        ? "اختر البلدية"
                        : "Sélectionner Commune"}
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
            <div
              className={`flex justify-end ${
                language === "ar" ? "gap-x-8" : "space-x-8"
              }`}
            >
              <button
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleCloseDialog}
              >
                {language === "ar" ? "إلغاء" : "Annuler"}
              </button>
              <button
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className={`text-blue-500 cursor-pointer hover:text-blue-700 ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaveCustomer}
                disabled={!isFormValid}
              >
                {language === "ar" ? "حفظ" : "Enregistrer"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        )}
      </Modal>
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
    </div>
  );
}
