import React, { useState, useMemo } from "react";
import axios from "axios";
import { TokenDecoder } from "../util/DecodeToken";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "react-modal";

// Icon components
const EditIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EmptyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Helper function for formatting dates with Arabic month names
const formatDate = (dateString, language) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();

  // Custom Arabic month names
  const arabicMonths = [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // French month names
  const frenchMonths = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const month =
    language === "ar"
      ? arabicMonths[date.getMonth()]
      : frenchMonths[date.getMonth()];

  // Format based on language
  if (language === "ar") {
    return `${day} ${month} ${year}`;
  } else {
    return `${day} ${month} ${year}`;
  }
};

export default function PubSwiperStore({
  data,
  loading,
  StorePublicityRefetch,
  user,
  language,
  handleOpenModalAddPub,
}) {
  const decodedToken = TokenDecoder();
  const [DeletePub, setDeletePub] = useState(false);
  const [deletedPublicity, setDeletedPublicity] = useState(null);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pubFilter, setPubFilter] = useState("all");

  // State for image preview modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPub, setSelectedPub] = useState(null);

  // Filtered data based on selected filter
  const filteredPublicityData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (pubFilter === "all") return data;
    return data.filter((pub) => pub.distination === pubFilter);
  }, [data, pubFilter]);

  const handleOpenDeletePub = (id, e) => {
    e.stopPropagation(); // Prevent triggering the image modal
    setDeletePub(true);
    setDeletedPublicity(id);
  };

  const handleImageClick = (pub) => {
    setSelectedImage(
      `${import.meta.env.VITE_APP_URL_BASE.replace("/api", "")}/files/${
        pub.image
      }`
    );
    setSelectedPub(pub);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setSelectedPub(null);
  };

  const handleDeletePublicity = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.delete(
        import.meta.env.VITE_APP_URL_BASE +
          `/Publicity/deleteFromStore/${deletedPublicity}/${decodedToken.id}`,
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
        StorePublicityRefetch();
        setDeletePub(false);
        setDeletedPublicity(null);
      } else {
        setAlertType(true);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setDeletedPublicity(null);
      }
    } catch (error) {
      setAlertType(true);
      if (error.response) {
        setSnackbarMessage(error.response.data.message);
      } else {
        setSnackbarMessage("An error occurred while deleting the publicity");
      }
      setSnackbarOpen(true);
    } finally {
      setSubmitionLoading(false);
    }
  };

  return (
    <div className="pb-8">
      {/* Filter Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            pubFilter === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setPubFilter("all")}
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "جميع الإعلانات" : "Toutes les publicités"}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            pubFilter === "private"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setPubFilter("private")}
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "الإعلانات الخاصة" : "Publicités privées"}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            pubFilter === "public"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setPubFilter("public")}
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "الإعلانات العامة" : "Publicités publiques"}
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading || submitionLoading ? (
          // Loading state
          Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden h-64 animate-pulse"
              >
                <div className="h-full bg-gray-200"></div>
              </div>
            ))
        ) : !Array.isArray(data) || data.length === 0 ? (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <EmptyIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p
              className="text-gray-500 text-center"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "لا توجد إعلانات متاحة"
                : "Aucune publicité disponible"}
            </p>
            <button
              onClick={handleOpenModalAddPub}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "إضافة إعلان جديد"
                : "Ajouter une nouvelle publicité"}
            </button>
          </div>
        ) : (
          // Publicity items
          filteredPublicityData.map((pub) => (
            <div
              key={pub._id}
              className="bg-white rounded-lg shadow-md overflow-hidden h-64 relative group cursor-pointer"
              style={{
                opacity:
                  pub.distination === "public" && pub.displayPublic === false
                    ? 0.5
                    : 1,
              }}
              onClick={() => handleImageClick(pub)}
            >
              <img
                src={`${import.meta.env.VITE_APP_URL_BASE.replace(
                  "/api",
                  ""
                )}/files/${pub.image}`}
                alt={pub.image}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                    {pub.distination === "private"
                      ? language === "ar"
                        ? "خاص"
                        : "Privé"
                      : language === "ar"
                      ? "عام"
                      : "Public"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleOpenDeletePub(pub._id, e)}
                      className="p-2 bg-white/90 rounded-full text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <span className="text-white text-xs mt-2">
                  {formatDate(pub.createdAt, language)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={imageModalOpen}
        onRequestClose={handleCloseImageModal}
        contentLabel={
          language === "ar" ? "عرض الإعلان" : "Afficher la publicité"
        }
        className="imagePreviewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            border: "none",
            background: "transparent",
            overflow: "visible",
            borderRadius: "0",
            padding: "0",
            width: "95%",
            maxWidth: "1200px",
            maxHeight: "90vh",
          },
        }}
      >
        {selectedPub && (
          <div className="animate-fadeIn">
            <button
              onClick={handleCloseImageModal}
              className="absolute top-0 left-0 p-3 text-black/40 hover:text-black hover:scale-105 transition-all duration-300 z-10"
              aria-label="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>

            <div className="bg-white overflow-hidden rounded-2xl shadow-2xl transform transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Image Section with Gradient Overlay */}
                <div className="w-full md:w-3/4 relative overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt="Advertisement"
                    className="w-full h-auto object-contain max-h-[80vh] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent h-24 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Image Controls - Visible on Hover */}
                  <div className="absolute bottom-4 left-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-medium"
                    >
                      {formatDate(selectedPub.createdAt, language)}
                    </span>
                  </div>
                </div>

                {/* Details Panel with Gradient Background */}
                <div
                  className="w-full md:w-1/4 md:max-w-xs bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col relative overflow-hidden"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {/* Decorative Element */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-50 opacity-50"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-indigo-50 opacity-40"></div>

                  <div className="relative z-10">
                    <h3
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="text-xl font-semibold mb-6 border-b border-gray-200 pb-2"
                    >
                      {language === "ar"
                        ? "تفاصيل الإعلان"
                        : "Détails de la publicité"}
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <p
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          className="text-sm text-gray-500 mb-1"
                        >
                          {language === "ar" ? "التاريخ" : "Date"}:
                        </p>
                        <p className="text-sm font-medium">
                          {formatDate(selectedPub.createdAt, language)}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          className="text-sm text-gray-500 mb-1"
                        >
                          {language === "ar" ? "الوجهة" : "Destination"}:
                        </p>
                        <p
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium inline-block ${
                            selectedPub.distination === "private"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {selectedPub.distination === "private"
                            ? language === "ar"
                              ? "خاص"
                              : "Privé"
                            : language === "ar"
                            ? "عام"
                            : "Public"}
                        </p>
                      </div>

                      {selectedPub.distination === "public" && (
                        <div>
                          <p
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                            className="text-sm text-gray-500 mb-1"
                          >
                            {language === "ar" ? "الحالة" : "État"}:
                          </p>
                          <p
                            className={`px-3 py-1.5 rounded-full text-xs font-medium inline-block ${
                              selectedPub.displayPublic
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {selectedPub.displayPublic
                              ? language === "ar"
                                ? "مرئي"
                                : "Visible"
                              : language === "ar"
                              ? "في انتظار الموافقة"
                              : "En attente d'approbation"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 relative z-10">
                    <button
                      onClick={(e) => {
                        handleOpenDeletePub(selectedPub._id, e);
                        handleCloseImageModal();
                      }}
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-x-2"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      {language === "ar"
                        ? "حذف الإعلان"
                        : "Supprimer la publicité"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={DeletePub}
        onClose={() => {
          setDeletePub(false);
          setDeletedPublicity(null);
        }}
        onConfirm={handleDeletePublicity}
        dialogTitle={
          language === "ar"
            ? "تأكيد حذف الإعلان"
            : "Confirmer la suppression de la publicité"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد حذف هذا الإعلان؟"
            : "Êtes-vous sûr de vouloir supprimer cette publicité ?"
        }
        loading={submitionLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: language === "ar" ? "left" : "right",
        }}
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
