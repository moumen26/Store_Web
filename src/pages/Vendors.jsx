import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import VendorsTable from "../components/VendorsTable";
import ButtonExportExel from "../components/ButtonExportExel";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useLocation } from "react-router-dom";
import { CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import Modal from "react-modal";

export default function Vendors() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  //form
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Email, setEmail] = useState("");
  const [RC, setRC] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
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
      `${import.meta.env.VITE_APP_URL_BASE}/MyStores/sellers/${
        decodedToken.id
      }`,
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
    queryKey: ["CustomersData", user?.token],
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
          `/auth/createNewSeller/${decodedToken.id}`,
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
        console.error("Error creating new vendeur: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating new vendeur");
      }
    }
  };

  return (
    <div className="pagesContainer">
      <div className="pagesContainerTop">
        <Header />
        <div className="titlePageButton">
            <h2 className="pagesTitle">Vendors</h2>
            <ButtonAdd
              buttonSpan="Add New Vendor"
              onClick={handleAddCustomerClick}
            />
        </div>
      </div>

      <div className="pageTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Search by Vendor..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Customers" />
        </div>
        <div className="pageTableContainer">
          <VendorsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            data={CustomersData}
            dataLoading={CustomersDataLoading}
          />
        </div>
      </div>

      <Modal
        isOpen={openDialog}
        onRequestClose={handleCloseDialog}
        contentLabel="Add New Vendor"
        className="addNewModal addNewCustomerModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!submitionLoading ? (
          <div className="customerClass pb-0">
            <h2 className="dialogTitle">Add New Vandor</h2>
            <div className="flex-col items-center w-full space-y-8 mt-[16px] p-0">
              <div className="dialogAddCustomerItem">
                <span>First Name</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="customerFirstName"
                    value={FirstName}
                    onChange={handleFirstNameChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Last Name</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="customerLastName"
                    value={LastName}
                    onChange={handleLastNameChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Address</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="storeAddress"
                    value={Address}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Number Phone</span>
                <div className="inputForm">
                  <input
                    type="phone"
                    name="customerPhone"
                    value={Phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Email</span>
                <div className="inputForm">
                  <input
                    type="email"
                    name="storeAddress"
                    value={Email}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Numero de registre de commerce</span>
                <div className="inputForm">
                  <input
                    type="text"
                    name="rc"
                    value={RC}
                    onChange={handleRCChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Password</span>
                <div className="inputForm">
                  <input
                    type="password"
                    name="password"
                    value={Password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem">
                <span>Confirm password</span>
                <div className="inputForm">
                  <input
                    type="password"
                    name="ConfirmPassword"
                    value={ConfirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
              </div>
              <div className="dialogAddCustomerItem wilayaCommune">
                <div className="WilayaCommuneClass">
                  <span>Wilaya</span>
                  <div className="selectStoreWilayaCommune">
                    <select
                      name="fournisseurWilaya"
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
                <div className="WilayaCommuneClass">
                  <span>Commune</span>
                  <div className="selectStoreWilayaCommune">
                    <select
                      name="fournisseurCommune"
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
            </div>
            <div className="flex justify-end space-x-8 mt-[20px]">
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className={`text-blue-500 cursor-pointer hover:text-blue-700 ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaveCustomer}
                disabled={!isFormValid}
              >
                Save
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
