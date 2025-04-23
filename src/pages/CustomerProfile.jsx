import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useParams } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import CustomerStatsCard from "../components/CustomerStatsCard";
import CustomerProfileOrdersTable from "../components/CustomerProfileOrdersTable";
import Search from "../components/Search";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { TokenDecoder } from "../util/DecodeToken";
import ButtonLight from "../components/ButtonLight";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "react-modal";
import { PlusIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { formatNumber } from "../util/useFullFunctions";

import { EqualsIcon } from "@heroicons/react/16/solid";

// Ensure you set the root element for accessibility
Modal.setAppElement("#root");

export default function CustomerProfile({
  onToggle,
  toggleLanguage,
  language,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [dialogOpenMakeVendor, setDialogOpenMakeVendor] = useState(false);
  const [confirmDialogOpenMakeVendor, setConfirmDialogOpenMakeVendor] =
    useState(false);
  const [buttonVendorText, setButtonVendorText] = useState("");

  const handleButtonVendorClick = () => {
    if (
      buttonVendorText === "Définir comme vendeur" ||
      buttonVendorText === "تعيين كبائع"
    ) {
      setDialogOpenMakeVendor(true);
    } else {
      setConfirmDialogOpenMakeVendor(true);
    }
  };

  const handleCloseDialogVendor = () => {
    setDialogOpenMakeVendor(false);
    setConfirmDialogOpenMakeVendor(false);
  };
  const [newAddressNameCustomer, setnewAddressNameCustomer] = useState("");
  const handleAddressNameChange = (e) => {
    setnewAddressNameCustomer(e.target.value);
  };
  const [newAddressCustomer, setNewAddressCustomer] = useState("");
  const handleAddressChange = (e) => {
    setNewAddressCustomer(e.target.value);
  };

  const [confirmDialogOpenAddingAddress, setConfirmDialogOpenAddingAddress] =
    useState(false);
  const handleOpenConfirmDialogAddingAddress = () => {
    setConfirmDialogOpenAddingAddress(true);
  };
  const handleCloseDialogAddingAddress = () => {
    setConfirmDialogOpenAddingAddress(false);
    setNewAddressCustomer("");
  };

  const handleConfirmAsVendor = async () => {
    //API call to make the user a vendor
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/MyStores/makeSeller/${decodedToken.id}`,
        {
          isSeller: true,
          user: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchCustomerData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialogVendor();
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
        console.error("Error updating selling option: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating selling option");
      }
    }
  };

  const handleConfirmAsCustomer = async () => {
    //API call to make the user a customer
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/MyStores/makeSeller/${decodedToken.id}`,
        {
          isSeller: false,
          user: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchCustomerData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialogVendor();
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
        console.error("Error updating selling option: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating selling option");
      }
    }
  };

  const handleConfirmAddingAddress = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/MyStores/addAddress/${decodedToken.id}`,
        {
          user: id,
          address: newAddressCustomer,
          name: newAddressNameCustomer,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchCustomerData();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDialogAddingAddress();
        handleCloseModalAddAddress();
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
        console.error("Error adding address: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding address");
      }
    }
  };
  //Modal add address
  const [modalIsOpenAddAddress, setModalIsOpenAddAdress] = useState(false);

  const handleOpenModalAddAddress = () => {
    setModalIsOpenAddAdress(true);
  };

  const handleCloseModalAddAddress = () => {
    setModalIsOpenAddAdress(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //---------------------------------API calls---------------------------------\\

  // Define a function that fetches the customer data
  const fetchCustomerData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Client/${id}/${decodedToken.id}`,
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
    refetch: refetchCustomerData,
  } = useQuery({
    queryKey: ["CustomerData", user?.token, location.key, id],
    queryFn: fetchCustomerData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // Define a function that fetches the Order data
  const fetchOrderData = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/clientForStore/${id}/${
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
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return {};
      else throw new Error("Error receiving Order data");
    }

    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the Order data
  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: refetchOrderDataData,
  } = useQuery({
    queryKey: ["OrderData", id, user?.token, location.key, id],
    queryFn: () => fetchOrderData(id),
    enabled: !!id && !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // fetching statistics data
  const fetchOrderStatisticsData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Receipt/statistics/${decodedToken.id}/${id}`,
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
      else throw new Error("Error receiving order by client data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: OrderStatisticsData,
    error: OrderStatisticsDataError,
    isLoading: OrderStatisticsDataLoading,
    refetch: OrderStatisticsDataRefetch,
  } = useQuery({
    queryKey: ["OrderStatisticsData", user?.token, location.key],
    queryFn: fetchOrderStatisticsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  const handleCreateOrder = () => {
    navigate(`/AddOrder/${id}`, { state: CustomerData });
  };

  useEffect(() => {
    //set selling option
    if (CustomerData?.isSeller == true) {
      setButtonVendorText(
        language === "ar" ? "هو بالفعل بائع" : "Est déjà vendeur"
      );
    } else if (CustomerData?.isSeller == false) {
      setButtonVendorText(
        language === "ar" ? "تعيين كبائع" : "Définir comme vendeur"
      );
    }
  }, [CustomerData, buttonVendorText]);

  if (CustomerDataLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <Header />
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
          {/* <h1>Loading...</h1> */}
        </div>
      </div>
    );
  }
  if (CustomerDataError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="customerClass">
          <h2 className="customerClassTitle">
            {language === "ar"
              ? "لا توجد بيانات متاحة"
              : "Aucune donnée disponible"}
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="flexHeader">
        <div onClick={onToggle} className="equalsIcon">
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header toggleLanguage={toggleLanguage} language={language} />
      </div>
      <div className="customerTop">
        <div className="flex items-center space-x-1">
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "العملاء" : "Clients"}
          </span>
          {language === "ar" ? (
            <ChevronLeftIcon className="iconAsideBar" />
          ) : (
            <ChevronRightIcon className="iconAsideBar" />
          )}
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {CustomerData
              ? `${CustomerData?.firstName} ${CustomerData?.lastName}`
              : ""}
          </span>
        </div>
        <div
          className={`flex items-center space-x-2 ${
            language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
          }`}
        >
          {(CustomerData?.isSeller == true ||
            CustomerData?.isSeller == false) && (
            <ButtonLight
              buttonSpan={buttonVendorText}
              onClick={handleButtonVendorClick}
              language={language}
            />
          )}
          <ConfirmDialog
            open={dialogOpenMakeVendor}
            onClose={handleCloseDialogVendor}
            onConfirm={handleConfirmAsVendor}
            language={language}
            dialogTitle={
              language === "ar" ? "تأكيد البائع" : "Confirmer le vendeur"
            }
            dialogContentText={
              language === "ar"
                ? "هل أنت متأكد أنك تريد جعله بائعًا؟"
                : "Êtes-vous sûr de vouloir en faire un vendeur ?"
            }
            isloading={submitionLoading}
          />
          <ConfirmDialog
            open={confirmDialogOpenMakeVendor}
            onClose={handleCloseDialogVendor}
            onConfirm={handleConfirmAsCustomer}
            dialogTitle={
              language === "ar"
                ? "إلغاء خيار البائع"
                : "Annuler l'option vendeur"
            }
            dialogContentText={
              language === "ar"
                ? "هل أنت متأكد أنك تريد إلغاء خيار البائع وجعله زبونًا؟"
                : "Êtes-vous sûr de vouloir annuler l'option vendeur et en faire un client ?"
            }
            isloading={submitionLoading}
          />
          <ButtonAdd
            buttonSpan={language === "ar" ? "إنشاء طلب" : "Créer une commande"}
            showIcon={false}
            language={language}
            onClick={handleCreateOrder}
          />
        </div>
      </div>
      <div className="customerClass paddingClass">
        <h2
          className="customerClassTitle"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar"
            ? "المعلومات الشخصية"
            : "Informations personnelles"}
        </h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الاسم" : "Prénom"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "اللقب" : "Nom"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.phoneNumber}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الولاية" : "Wilaya"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "البلدية" : "Commune"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.commune}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المعرف" : "ID"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?._id}
            </h3>
          </div>
        </div>
      </div>
      {CustomerData?.storeAddresses &&
      CustomerData?.storeAddresses.length > 0 ? (
        <div className="customerClass paddingClass">
          <div className="flex justify-between items-center">
            <h2
              className="customerClassTitle"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "عنوان التسليم" : "Adresse de livraison"}
            </h2>
            <ButtonAdd
              buttonSpan={
                language === "ar"
                  ? "إضافة عنوان جديد"
                  : "Ajouter une nouvelle adresse"
              }
              onClick={handleOpenModalAddAddress}
            />
            <Modal
              isOpen={modalIsOpenAddAddress}
              onRequestClose={handleCloseModalAddAddress}
              contentLabel={
                language === "ar" ? "إضافة عنوان جديد" : "Ajouter une adresse"
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
                  className="customerClassTitle"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "إضافة عنوان جديد"
                    : "Ajouter une nouvelle adresse"}
                </h2>
                <div className="flex justify-end items-center space-x-4">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "الاسم :" : "Nom :"}
                  </span>
                  <div className="inputForm pl-0">
                    <input
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      type="text"
                      name="newAddressNameCustomer"
                      value={newAddressNameCustomer}
                      onChange={handleAddressNameChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-4">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "العنوان :" : "Adresse :"}
                  </span>
                  <div className="inputForm pl-0">
                    <input
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      type="text"
                      name="newAddressCustomer"
                      value={newAddressCustomer}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div
                  className={`flex justify-end space-x-4 ${
                    language === "ar" ? "gap-x-4" : ""
                  }`}
                >
                  <button
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={handleCloseModalAddAddress}
                  >
                    {language === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <button
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={handleOpenConfirmDialogAddingAddress}
                  >
                    {language === "ar" ? "حفظ" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </Modal>

            <ConfirmDialog
              open={confirmDialogOpenAddingAddress}
              onConfirm={handleConfirmAddingAddress}
              onClose={handleCloseDialogAddingAddress}
              dialogTitle={
                language === "ar"
                  ? "تأكيد إضافة العنوان"
                  : "Confirmer l'ajout de l'adresse"
              }
              dialogContentText={
                language === "ar"
                  ? `هل أنت متأكد أنك تريد إضافة العنوان "${newAddressCustomer}"؟`
                  : `Êtes-vous sûr de vouloir ajouter l'adresse "${newAddressCustomer}" ?`
              }
            />
          </div>
          <div className="customerPrimaryAddress">
            {CustomerData?.storeAddresses.map((item, index) => (
              <CustomerPrimaryDelivery
                key={index}
                name={item.name}
                primaryDeliveryAddress={item.address}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="customerClass paddingClass Stats">
        <h2
          className="customerClassTitle"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "الإحصائيات" : "Statistiques"}
        </h2>
        <div className="flexCard">
          <CustomerStatsCard
            customerStatsCardTitle={
              language === "ar" ? "إجمالي الطلبات" : "Total des commandes"
            }
            customerStatsCardDetails={OrderStatisticsData?.count}
            loading={OrderStatisticsDataLoading}
            language={language}
          />
          <CustomerStatsCard
            customerStatsCardTitle={
              language === "ar" ? "المبلغ الإجمالي" : "Montant total"
            }
            customerStatsCardDetails={formatNumber(OrderStatisticsData?.total)}
            loading={OrderStatisticsDataLoading}
            language={language}
          />
          <CustomerStatsCard
            customerStatsCardTitle={
              language === "ar" ? "إجمالي المدفوع" : "Total payé"
            }
            customerStatsCardDetails={formatNumber(
              OrderStatisticsData?.totalPaid
            )}
            language={language}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle={
              language === "ar" ? "إجمالي غير المدفوع" : "Total impayé"
            }
            customerStatsCardDetails={`- ${formatNumber(
              OrderStatisticsData?.creditanpaid
            )}`}
            language={language}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle={
              language === "ar" ? "إجمالي الأرباح" : "Total des bénéfices"
            }
            language={language}
            customerStatsCardDetails={formatNumber(OrderStatisticsData?.profit)}
            loading={OrderStatisticsDataLoading}
          />
        </div>
      </div>

      <div className="customerClass justify-start paddingClass customerOrdersClass">
        <div className="flex justify-between items-center">
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الطلبات" : "Commandes"}
          </h2>
          <Search
            placeholder={
              language === "ar"
                ? "البحث حسب الطلب..."
                : "Rechercher par commande..."
            }
            onChange={handleSearchChange}
            language={language}
          />
        </div>
        <CustomerProfileOrdersTable
          searchQuery={searchQuery}
          setFilteredData={setFilteredData}
          data={OrderData}
          loading={OrderDataLoading}
          language={language}
        />
      </div>
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
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {snackbarMessage}
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}
