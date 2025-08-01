import React, { useRef, useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ProductsContainer from "../components/ProductsContainer";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { EqualsIcon } from "@heroicons/react/16/solid";

import { TokenDecoder } from "../util/DecodeToken";

// Set the app element for accessibility
Modal.setAppElement("#root");

export default function ProductsGrid({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Category, setCategory] = useState("");
  const handelCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  //product form
  const [productName, setProductName] = useState("");
  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };
  const [productSize, setProductSize] = useState("");
  const handleProductSizeChange = (e) => {
    setProductSize(e.target.value);
  };
  const [productBoxItems, setProductBoxItems] = useState("");
  const handleProductBoxItemsChange = (e) => {
    setProductBoxItems(e.target.value);
  };
  const [productBrand, setProductBrand] = useState("");
  const handleProductBrandChange = (e) => {
    setProductBrand(e.target.value);
  };
  const [productCategory, setProductCategory] = useState("");
  const handleProductCategoryChange = (e) => {
    setProductCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  // fetching Product data
  const fetchProductData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Product/store/${decodedToken.id}`,
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
      else throw new Error("Error receiving Product data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: ProductData,
    error: ProductError,
    isLoading: ProductLoading,
    refetch: ProductRefetch,
  } = useQuery({
    queryKey: ["ProductData", user?.token, location.key],
    queryFn: fetchProductData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Brand data
  const fetchBrandData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE + `/Brand`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Brand data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: BrandData,
    error: BrandError,
    isLoading: BrandLoading,
    refetch: BrandRefetch,
  } = useQuery({
    queryKey: ["BrandData", user?.token, location.key],
    queryFn: fetchBrandData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Category data
  const fetchCategoryData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Category/store/${decodedToken.id}`,
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
    queryKey: ["CategoryData", user?.token, location.key],
    queryFn: fetchCategoryData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    ProductRefetch();
    CategoryRefetch();
    BrandRefetch();
  };

  //save product API
  const handleSavePRODUCT = async () => {
    try {
      setSubmitionLoading(true);
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("file", image);
      formData.append("Name", productName);
      formData.append("Category", productCategory);
      formData.append("Size", productSize);
      formData.append("Brand", productBrand);
      formData.append("BoxItems", productBoxItems);

      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE + `/Product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
        handleCloseAddProductModal();
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
        console.error("Error creating product: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating product");
      }
    }
  };

  return (
    <div
      className="pagesContainer pageContainerProductGrid"
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
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="pagesTitle"
          >
            {language === "ar" ? "المنتجات" : "Produits"}
          </h2>
          <div className="buttonTop">
            <ButtonAdd
              language={language}
              buttonSpan={
                language === "ar"
                  ? "إضافة منتج جديد للقائمة"
                  : "Ajouter un Nouveau Produit a la Liste"
              }
              onClick={handleOpenAddProductModal}
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
                ? "البحث عن طريق المنتج..."
                : "Rechercher par Produit..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            language={language}
          />
          <div className="span-input">
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الفئة :" : "Catégorie"}
            </span>
            <div className="selectStoreWilayaCommune">
              <select
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                name="productCategory"
                onChange={handelCategoryChange}
              >
                <option value="" disabled selected>
                  {language === "ar"
                    ? "-- اختر فئة المنتج --"
                    : "-- Sélectionnez la Catégorie de Produit --"}
                </option>
                {CategoryData?.map((category) => (
                  <option
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="pageTableContainer">
          <ProductsContainer
            searchQuery={searchQuery}
            data={ProductData}
            language={language}
            selectedCategory={Category}
          />
        </div>
      </div>
      {/* New Modal for Adding Product */}
      <Modal
        isOpen={isAddProductModalOpen}
        onRequestClose={handleCloseAddProductModal}
        contentLabel={language === "ar" ? "إضافة منتج جديد" : "Add New Product"}
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {!submitionLoading || BrandLoading || CategoryLoading ? (
          <div
            className="customerClass pb-0"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="dialogTitle"
            >
              {language === "ar"
                ? "إضافة منتج جديد إلى المخزون"
                : "Ajouter un Nouveau Produit a la Liste"}
            </h2>
            <div className="mt-[16px]">
              <form>
                <div className="flex-col space-y-8 mb-5">
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "اسم المنتج :" : "Nom du Produit :"}
                    </span>
                    <div className="inputForm">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="text"
                        name="productName"
                        onChange={handleProductNameChange}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "حجم المنتج :"
                        : "Taille du Produit :"}
                    </span>
                    <div className="inputForm">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="text"
                        name="productName"
                        onChange={handleProductSizeChange}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "لكل صندوق :"
                        : "Articles par Boîte :"}
                    </span>
                    <div className="inputForm">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="number"
                        name="productName"
                        onChange={handleProductBoxItemsChange}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "فئة المنتج :"
                        : "Catégorie de Produit :"}
                    </span>
                    <div className="selectStoreWilayaCommune w-[500px]">
                      <select
                        name="productCategory"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        onChange={handleProductCategoryChange}
                      >
                        <option value="" disabled selected>
                          {language === "ar"
                            ? "-- اختر فئة المنتج --"
                            : "-- Sélectionnez la Catégorie de Produit --"}
                        </option>
                        {CategoryData?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "ماركة المنتج :"
                        : "Marque du Produit :"}
                    </span>
                    <div className="selectStoreWilayaCommune w-[500px]">
                      <select
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        name="productCategory"
                        onChange={handleProductBrandChange}
                      >
                        <option value="" disabled selected>
                          {language === "ar"
                            ? "-- اختر ماركة المنتج --"
                            : "-- Sélectionnez la Marque du Produit --"}
                        </option>
                        {BrandData?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "صورة المنتج :"
                        : "Image du Produit :"}
                    </span>
                    <div className="productPicture">
                      <div
                        className="w-[80px] h-[80px] bg-slate-200 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden"
                        onClick={handleClick}
                      >
                        {image ? (
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <PhotoIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="uploadClass">
                        <input
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                            display: "none",
                          }}
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                        <p onClick={handleClick} className="uploadSpan">
                          <span
                            className="text-blue-600"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "انقر لتحميل"
                              : "Cliquez pour télécharger"}{" "}
                          </span>
                          {language === "ar"
                            ? "أو اسحب وأفلت ملف SVG أو PNG أو JPG"
                            : "ou glissez-déposez un fichier SVG, PNG, JPG"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex justify-end space-x-8 ${
                    language === "ar" ? "space-x-reverse" : ""
                  }`}
                >
                  <button
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={handleCloseAddProductModal}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <input
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    type="button"
                    value={language === "ar" ? "حفظ" : "Enregistrer"}
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={handleSavePRODUCT}
                  />
                </div>
              </form>
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
        autoHideDuration={6000}
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
