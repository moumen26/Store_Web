import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerStatsCard from "../components/CustomerStatsCard";
import Search from "../components/Search";
import FournisseurProfileAchatsTable from "../components/FournisseurProfileAchatsTable";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import Modal from "react-modal";
import { EqualsIcon } from "@heroicons/react/16/solid";

import ButtonLight from "../components/ButtonLight";
import { formatNumber } from "../util/useFullFunctions";
import axios from "axios";

export default function FournisseurProfile({
  onToggle,
  toggleLanguage,
  language,
}) {
  const { id } = useParams();
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  const navigate = useNavigate();

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [PaymentAmount, setPaymentAmount] = useState(0);
  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [FilteredPurchaseResponse, setFilteredPurchaseResponse] = useState([]);

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 15,
    has_next_page: false,
    has_prev_page: false,
  });

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle pagination info from OrdersTable
  const handlePaginationChange = useCallback((paginationData) => {
    setPaginationInfo(paginationData);
    setTotalPages(paginationData.total_pages || 0);
    setTotalItems(paginationData.total_items || 0);
    setTotalPrice(paginationData.total_price || 0);
  }, []);

  // Calculate summary data for cards
  const summaryData = {
    totalOrders: totalItems, // Use server-side total
    totalAmount: totalPrice, // This shows amount for current page only
  };
  // Build query parameters for server-side filtering
  const buildQueryParams = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "15",
    });

    if (searchQuery && searchQuery.trim() !== "") {
      params.append("search", searchQuery.trim());
    }

    return params.toString();
  };

  const [addPayementModal, setAddPayementModal] = useState(false);

  const handleOpenAddPayementModal = () => {
    setAddPayementModal(true);
  };

  const handleCloseAddPaymentDialog = () => {
    setAddPayementModal(false);
  };

  //---------------------------------API calls---------------------------------\\

  // fetching OneFournisseur data
  const fetchOneFournisseurData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Fournisseur/one/${id}`,
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
    data: OneFournisseurData,
    error: OneFournisseurError,
    isLoading: OneFournisseurLoading,
    refetch: OneFournisseurRefetch,
  } = useQuery({
    queryKey: ["OneFournisseurData", user?.token, location.key],
    queryFn: fetchOneFournisseurData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    retryDelay: 1000,
    keepPreviousData: true, // Keep previous data while loading new data
  });

  // fetching Achat Data By Fournisseur data
  const fetchAchatDataByFournisseur = async () => {
    const queryParams = buildQueryParams();
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/all/${decodedToken.id}/${id}?${queryParams}`,
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
      if (errorData.error.statusCode == 404) {
        return {
          data: [],
          pagination: {
            total_pages: 0,
            total_items: 0,
            current_page: 1,
            items_per_page: 15,
            has_next_page: false,
            has_prev_page: false,
          },
          filters: {
            search: searchQuery || "",
          },
        };
      } else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: PurchaseResponse,
    error: AchatDataByFournisseurError,
    isLoading: AchatDataByFournisseurLoading,
    refetch: AchatDataByFournisseurRefetch,
  } = useQuery({
    queryKey: [
      "AchatDataByFournisseur",
      user?.token,
      currentPage,
      searchQuery,
      location.key
    ],
    queryFn: fetchAchatDataByFournisseur,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    retryDelay: 1000,
    keepPreviousData: true, // Keep previous data while loading new data
  });
  // Transform PurchasesResponse into rows when it changes
  useEffect(() => {
    if (PurchaseResponse?.data?.length > 0) {
      setFilteredPurchaseResponse(PurchaseResponse.data); // Update PurchasesData state

      // Pass pagination info to parent
      if (handlePaginationChange) {
        handlePaginationChange(PurchaseResponse.pagination);
      }
    } else {
      setFilteredPurchaseResponse([]); // Reset PurchasesData if no data is returned
      // Pass empty pagination info to parent
      if (handlePaginationChange) {
        handlePaginationChange({
          total_pages: 0,
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          has_next_page: false,
          has_prev_page: false,
        });
      }
    }
  }, [PurchaseResponse, setFilteredPurchaseResponse, handlePaginationChange]);

  // fetching statistics data
  const fetchAchatStatisticsData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/statistics/${decodedToken.id}/${id}`,
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
      else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: AchatStatisticsData,
    error: AchatStatisticsDataError,
    isLoading: AchatStatisticsDataLoading,
    refetch: AchatStatisticsDataRefetch,
  } = useQuery({
    queryKey: ["AchatStatisticsData", user?.token, location.key],
    queryFn: fetchAchatStatisticsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    retryDelay: 1000,
    keepPreviousData: true, // Keep previous data while loading new data
  });

  const handleConfirmAddPayment = async () => {
    //API call to make the user a vendor
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Purchase/process/payments/${decodedToken.id}`,
        {
          amount: PaymentAmount,
          fournisseurId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        AchatStatisticsDataRefetch();
        AchatDataByFournisseurRefetch();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseAddPaymentDialog();
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
        console.error("Error adding new payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding new payment");
      }
    }
  };

  const handleCreateOrder = () => {
    navigate(`/AddAchat/${id}`, { state: OneFournisseurData });
  };

  if (OneFournisseurLoading) {
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
      </div>{" "}
      <div className="customerTop">
        <div className="flex items-center space-x-1">
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الموردين" : "Fournisseurs"}
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
            #{OneFournisseurData?._id}
          </span>
        </div>
        <div
          className={`flex items-center space-x-2 ${
            language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
          }`}
        >
          <ButtonLight
            language={language}
            buttonSpan={language === "ar" ? "إضافة دفع" : "Ajouter un paiement"}
            onClick={handleOpenAddPayementModal}
          />
          <ButtonAdd
            buttonSpan={
              language === "ar" ? "إنشاء عملية شراء" : "Créer un achat"
            }
            showIcon={false}
            language={language}
            onClick={handleCreateOrder}
          />
          <Modal
            isOpen={addPayementModal}
            onRequestClose={handleCloseAddPaymentDialog}
            contentLabel={
              language === "ar"
                ? "إضافة دفعة جديدة"
                : "Ajouter un nouveau paiement"
            }
            className="addNewModal"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
            }}
          >
            <div
              className="customerClass pb-0"
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
            >
              <h2
                className="customerClassTitle"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "إضافة دفعة جديدة"
                  : "Ajouter un nouveau paiement"}
              </h2>
              <div className="dialogAddCustomerItem">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "المبلغ :" : "Montant :"}
                </span>
                <div className="inputForm">
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="number"
                    min={0}
                    name="addPayement"
                    onChange={handlePaymentAmountChange}
                  />
                </div>
              </div>

              <div
                className={`flex justify-end ${
                  language === "ar" ? "gap-x-4" : "space-x-4"
                }`}
              >
                {" "}
                {!submitionLoading ? (
                  <>
                    <button
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={handleCloseAddPaymentDialog}
                    >
                      {language === "ar" ? "إلغاء" : "Annuler"}
                    </button>
                    <button
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={handleConfirmAddPayment}
                    >
                      {language === "ar" ? "حفظ" : "Enregistrer"}
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
        </div>
      </div>
      <div
        className="customerClass paddingClass"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
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
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "الاسم" : "Prénom"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "اللقب" : "Nom"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.phoneNumber}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "الولاية" : "Wilaya"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationSpan"
            >
              {language === "ar" ? "البلدية" : "Commune"}
            </span>
            <h3
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="personalInformationDetails"
            >
              {OneFournisseurData?.commune}
            </h3>
          </div>
          {OneFournisseurData?.address && (
            <div className="flex-col">
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="personalInformationSpan"
              >
                {language === "ar" ? "العنوان" : "Adresse"}
              </span>
              <h3
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="personalInformationDetails"
              >
                {OneFournisseurData?.address}
              </h3>
            </div>
          )}
        </div>
      </div>
      <>
        <div
          className="customerClass paddingClass Stats"
          style={{
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          }}
        >
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="customerClassTitle"
          >
            {language === "ar" ? "الإحصائيات" : "Statistiques"}
          </h2>
          <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar">
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المشتريات" : "Total des achats"
              }
              customerStatsCardDetails={AchatStatisticsData?.count}
              className="flex-shrink-0 w-[280px] md:w-full"
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المبلغ" : "Montant total"
              }
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalAmount
              )}
              className="flex-shrink-0 w-[280px] md:w-full"
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي المدفوع" : "Total payé"
              }
              customerStatsCardDetails={formatNumber(
                AchatStatisticsData?.totalPayment
              )}
              className="flex-shrink-0 w-[280px] md:w-full"
            />
            <CustomerStatsCard
              language={language}
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle={
                language === "ar" ? "إجمالي غير المدفوع" : "Total impayé"
              }
              customerStatsCardDetails={`- ${formatNumber(
                AchatStatisticsData?.totalCreditUnpaid
              )}`}
              className="flex-shrink-0 w-[280px] md:w-full"
            />
          </div>
        </div>
        <div
          className="customerClass justify-start paddingClass customerOrdersClass"
          style={{
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          }}
        >
          <div className="flex justify-between items-center">
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="customerClassTitle"
            >
              {language === "ar" ? "المشتريات" : "Achats"}
            </h2>
            <Search
              placeholder={
                language === "ar"
                  ? "البحث عن طريق الشراء..."
                  : "Rechercher par l'achat..."
              }
              onChange={handleSearchChange}
              language={language}
            />
          </div>
          <FournisseurProfileAchatsTable
            language={language}
            data={FilteredPurchaseResponse}
            loading={AchatDataByFournisseurLoading}
          />
          {/* Modern Pagination - only show if there are multiple pages */}
          {totalPages > 1 && (
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              language={language}
            />
          )}

          {/* Pagination Info */}
          {totalItems > 0 && (
            <div className="pagination-info" style={{ 
              padding: "12px 20px", 
              fontSize: "14px", 
              color: "#6B7280",
              textAlign: language === "ar" ? "right" : "left",
              borderTop: "1px solid #E5E7EB"
            }}>
              {language === "ar" 
                ? `إظهار ${Math.min(paginationInfo.items_per_page, FilteredPurchaseResponse.length)} من أصل ${totalItems} طلب`
                : `Affichage de ${Math.min(paginationInfo.items_per_page, FilteredPurchaseResponse.length)} sur ${totalItems} commandes`
              }
            </div>
          )}

          {/* Active Filters Display */}
          {(debouncedSearchQuery) && (
            <div className="active-filters" style={{
              padding: "8px 20px",
              backgroundColor: "#F3F4F6",
              borderTop: "1px solid #E5E7EB",
              fontSize: "12px",
              color: "#6B7280"
            }}>
              <span style={{ fontWeight: "500" }}>
                {language === "ar" ? "المرشحات النشطة:" : "Filtres actifs:"}
              </span>
              {debouncedSearchQuery && (
                <span style={{ marginLeft: "8px", marginRight: "8px" }}>
                  {language === "ar" ? `البحث: "${debouncedSearchQuery}"` : `Recherche: "${debouncedSearchQuery}"`}
                </span>
              )}
            </div>
          )}
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
      </>
    </div>
  );
}
