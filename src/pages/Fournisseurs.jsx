import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import ButtonExportExel from "../components/ButtonExportExel";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import FournisseurTable from "../components/FournisseurTable";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Fournisseurs({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFournisseur, setNewFournisseur] = useState({
    fournisseurFirstName: "",
    fournisseurLastName: "",
    fournisseurAddress: "",
    fournisseurPhone: "",
    fournisseurWilaya: "",
    fournisseurCommune: "",
    fournisseurPhoto: null,
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [selectedWilaya, setselectedWilaya] = useState(null);
  const [selectedCommune, setselectedCommune] = useState(null);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFournisseurClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFirstNameInputChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameInputChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePhoneInputChange = (e) => {
    setPhone(e.target.value);
  };
  const handleAdrressInputChange = (e) => {
    setAddress(e.target.value);
  };
  const handleWilayaInputChange = (e) => {
    setselectedWilaya(e.target.value);
  };
  const handleCommuneInputChange = (e) => {
    setselectedCommune(e.target.value);
  };

  const validateForm = (fournisseur = newFournisseur) => {
    return (
      fournisseur.fournisseurFirstName &&
      fournisseur.fournisseurLastName &&
      fournisseur.fournisseurAddress &&
      fournisseur.fournisseurPhone &&
      fournisseur.fournisseurWilaya &&
      fournisseur.fournisseurCommune
    );
  };

  //---------------------------------API calls---------------------------------\\

  // fetching Fournisseur data
  const fetchFournisseurData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Fournisseur/${decodedToken.id}`,
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
      else throw new Error("Error receiving fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: FournisseurData,
    error: FournisseurError,
    isLoading: FournisseurLoading,
    refetch: FournisseurRefetch,
  } = useQuery({
    queryKey: ["FournisseurData", user?.token, location.key],
    queryFn: fetchFournisseurData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
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
    FournisseurRefetch();
    CitiesRefetch();
  };

  //save Fournisseur API
  const handleSaveFournisseur = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/Fournisseur/create/${decodedToken.id}`,
        {
          firstname: FirstName,
          lastname: LastName,
          phone: Phone,
          address: Address,
          wilaya: selectedWilaya,
          commune: selectedCommune,
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
        console.error("Error creating fournisseur: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating fournisseur", error);
      }
    }
  };

  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>{" "}
        <div className="titlePageButton">
          <h2 className="pagesTitle">
            {language === "ar" ? "الموردين" : "Fournisseurs"}
          </h2>
          <div className="buttonTop">
            <ButtonAdd
              buttonSpan={
                language === "ar"
                  ? "إضافة مورد جديد"
                  : "Ajouter un nouveau fournisseur"
              }
              onClick={handleAddFournisseurClick}
            />
          </div>
        </div>
      </div>

      <div className="pageTable">
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق المورد..."
                : "Rechercher par fournisseur..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={language === "ar" ? "الموردين" : "Fournisseurs"}
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <FournisseurTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            data={FournisseurData}
            loading={FournisseurLoading}
            language={language}
          />
        </div>
      </div>
      <Modal
        isOpen={openDialog}
        onRequestClose={handleCloseDialog}
        contentLabel={
          language === "ar"
            ? "إضافة مورد جديد"
            : "Ajouter un nouveau fournisseur"
        }
        className="addNewModal addNewCustomerModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!submitionLoading || CitiesLoading || FournisseurLoading ? (
          <div
            className="customerClass pb-0"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <h2 className="dialogTitle">
              {language === "ar"
                ? "إضافة مورد جديد"
                : "Ajouter un nouveau fournisseur"}
            </h2>
            <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
              <div className="dialogAddCustomerItem">
                <span>{language === "ar" ? "الاسم الأول" : "Prénom"}</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="fournisseurFirstName"
                    value={FirstName}
                    onChange={handleFirstNameInputChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>{language === "ar" ? "الاسم الأخير" : "Nom"}</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="fournisseurLastName"
                    value={LastName}
                    onChange={handleLastNameInputChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>
                  {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
                </span>
                <div className="inputForm">
                  <input
                    type="phone"
                    name="fournisseurPhone"
                    value={Phone}
                    onChange={handlePhoneInputChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>{language === "ar" ? "العنوان" : "Adresse"}</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="fournisseurAddress"
                    value={Address}
                    onChange={handleAdrressInputChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem wilayaCommune">
                <div className="WilayaCommuneClass">
                  <span>{language === "ar" ? "الولاية" : "Wilaya"}</span>
                  <div className="selectStoreWilayaCommune">
                    <select
                      name="fournisseurWilaya"
                      value={selectedWilaya}
                      onChange={handleWilayaInputChange}
                    >
                      <option value="" disabled selected>
                        {language === "ar"
                          ? "اختر ولاية"
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
                <div className="WilayaCommuneClass">
                  <span>{language === "ar" ? "البلدية" : "Commune"}</span>
                  <div className="selectStoreWilayaCommune">
                    <select
                      name="fournisseurCommune"
                      value={selectedCommune}
                      onChange={handleCommuneInputChange}
                    >
                      <option value="" disabled selected>
                        {language === "ar"
                          ? "اختر بلدية"
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
            </div>
            <div
              className={`flex justify-end ${
                language === "ar" ? "gap-x-8" : "space-x-8"
              }`}
            >
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleCloseDialog}
              >
                {language === "ar" ? "إلغاء" : "Annuler"}
              </button>
              <button
                className={`text-blue-500 cursor-pointer hover:text-blue-700 ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaveFournisseur}
                disabled={!isFormValid}
              >
                {language === "ar" ? "حفظ" : "Enregistrer"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[300px] h-[400px] flex items-center justify-center">
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
