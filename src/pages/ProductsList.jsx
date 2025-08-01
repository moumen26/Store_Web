import React, { useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import ProductTable from "../components/ProductTable";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import ProductCard from "../components/ProductCard";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { Alert, Snackbar } from "@mui/material";
import { TokenDecoder } from "../util/DecodeToken";
import axios from "axios";
import { EqualsIcon } from "@heroicons/react/16/solid";

Modal.setAppElement("#root");

export default function ProductsList({ onToggle, toggleLanguage, language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const [productState, setProductState] = useState({
    buyingByUnit: false,
    buyingByBox: false,
    addToProposedList: false,
  });

  //product form
  const [BuyingPrice, setBuyingPrice] = useState(0);
  const handleBuyingPriceChange = (e) => {
    setBuyingPrice(e.target.value);
  };
  const [SellingPrice, setSellingPrice] = useState(0);
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };
  const [Quantity, setQuantity] = useState(0);
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const [QuantityUnity, setQuantityUnity] = useState(0);
  const handleQuantityUnityChange = (e) => {
    setQuantityUnity(e.target.value);
  };

  const [LimitedQuantity, setLimitedQuantity] = useState(0);
  const handleLimitedQuantityChange = (e) => {
    setLimitedQuantity(e.target.value);
  };
  const [ExparationDate, setExparationDate] = useState("");
  const handleExparationDateChange = (e) => {
    setExparationDate(e.target.value);
  };
  const [Destocking, setDestocking] = useState(0);
  const handleDestockingChange = (e) => {
    setDestocking(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCheckboxChange = (event) => {
    setProductState({
      ...productState,
      [event.target.name]: event.target.checked,
    });
  };

  //---------------------------------API calls---------------------------------\\

  // fetching Stock data
  const fetchStockData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Stock/store/${decodedToken.id}`,
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
      else throw new Error("Error receiving Stock data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: StockData,
    error: StockError,
    isLoading: StockLoading,
    refetch: StockRefetch,
  } = useQuery({
    queryKey: ["StockData", user?.token],
    queryFn: fetchStockData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

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
    queryKey: ["ProductData", user?.token],
    queryFn: fetchProductData,
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
    queryKey: ["CategoryData", user?.token],
    queryFn: fetchCategoryData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    StockRefetch();
    ProductRefetch();
    CategoryRefetch();
  };

  //save Stock API
  const handleSaveStock = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE + `/Stock/create`,
        {
          Product: selectedProduct?._id,
          Quantity: Quantity,
          QuantityUnity: QuantityUnity,
          LimitedQuantity: LimitedQuantity,
          Store: decodedToken.id,
          BuyingPrice: BuyingPrice,
          SellingPrice: SellingPrice,
          ExparationDate: ExparationDate,
          BuyingMathode: productState,
          Destocking: Destocking,
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
        handleCloseModal();
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
        console.error("Error creating stock: No response received");
      } else {
        console.error("Error creating stock");
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
        </div>
        <div className="titlePageButton">
          <h2
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="pagesTitle"
          >
            {language === "ar" ? "مخزون المنتجات" : "Stock des produits"}
          </h2>
          {/* <div className="buttonTop">
            <ButtonAdd
              buttonSpan={
                language === "ar"
                  ? "الشراء بدون مورد"
                  : "Achat sans fournisseur"
              }
              onClick={handleOpenModal}
              language={language}
            />
          </div> */}
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
                : "Rechercher par produit..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            language={language}
            data={filteredData}
            filename={language === "ar" ? "المنتجات" : "Produits"}
          />
        </div>
        <div className="pageTableContainer">
          <ProductTable
            language={language}
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            STOCKData={StockData}
            isLoading={StockLoading}
            refetch={handleRefetchDataChange}
          />
        </div>
      </div>

      {/* Modal for adding new stock */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel={language === "ar" ? "إضافة مخزون جديد" : "Add New Stock"}
        className="addNewModal addNewStockModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {ProductLoading || CategoryLoading || submitionLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            <div
              className="customerClass"
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
            >
              <h2
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="customerClassTitle"
              >
                {language === "ar"
                  ? "إضافة شراء جديد بدون مورد"
                  : "Ajouter une achat sans Fournisseur"}
              </h2>
              <div className="addNewStockClass">
                <div className="w-full h-fit w-[65%] pr-2 addNewStockClass">
                  <div className="addProductModalHeader">
                    <Search
                      placeholder={
                        language === "ar"
                          ? "البحث عن طريق المنتج..."
                          : "Rechercher par produit..."
                      }
                      value={searchQuery}
                      onChange={handleSearchChange}
                      language={language}
                    />
                    <div className="flex gap-5 items-center">
                      <span
                        className={`${language === "ar" ? "ml-5" : ""}`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "الفئة :" : "Categorie :"}
                      </span>
                      <div className="selectStoreWilayaCommune w-[300px]">
                        <select
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          name="productCategory"
                          onChange={handleSelectedCategoryChange}
                        >
                          <option value="" disabled selected>
                            {language === "ar"
                              ? "-- اختر فئة --"
                              : "-- Sélectionner une catégorie --"}
                          </option>
                          {CategoryData.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="productsContainer p-0 mt-6">
                    {ProductData?.length > 0 ? (
                      ProductData?.filter(
                        (product) =>
                          (product.code
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                            product.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            product.brand?.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            product.category?.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase())) &&
                          (selectedCategory == "" ||
                            product.category?._id == selectedCategory)
                      ).map((product) => (
                        <ProductCard
                          key={product._id}
                          productName={
                            product.brand?.name +
                            " " +
                            product.name +
                            " " +
                            product.size
                          }
                          productImage={`${
                            import.meta.env.VITE_APP_FILES_URL
                          }/${product.image}`}
                          onClick={() => handleSelectProduct(product)}
                          selected={
                            selectedProduct &&
                            product._id === selectedProduct._id
                          }
                          language={language}
                        />
                      ))
                    ) : (
                      <span
                        className="thTableSpan"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar"
                          ? "لا توجد منتجات متاحة"
                          : "Aucun produit disponible"}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`h-fit productDetailsStock`}>
                  <div className="dialogAddCustomerItem items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "سعر الشراء :" : "Prix d'achat :"}
                    </span>
                    <div className="inputForm flex items-center">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="number"
                        name="buyingPrice"
                        value={BuyingPrice}
                        min={0}
                        onChange={handleBuyingPriceChange}
                      />
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "دج" : "DA"}
                      </span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "سعر البيع :" : "Prix de vente :"}
                      <span className="text-[10px] align-baseline">
                        {language === "ar" ? "(دج)" : "(DA)"}
                      </span>
                    </span>
                    <div className="inputForm flex items-center">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="number"
                        name="sellingPrice"
                        value={SellingPrice}
                        min={0}
                        onChange={handleSellingPriceChange}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex dialogAddCustomerItemBoth gap-x-4 items-center justify-between${
                      language === "ar" ? "justify-between" : ""
                    }`}
                  >
                    <div className="w-[50%] flex items-center">
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "كمية بالعلبة :" : "Qtt  / Box:"}
                      </span>
                      <div className="inputForm w-[80%]">
                        <input
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          type="number"
                          name="stock"
                          value={Quantity}
                          min={0}
                          onChange={handleQuantityChange}
                        />
                      </div>
                    </div>
                    <div className="w-[50%] flex items-center">
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "كمية بالوحدة :" : "Qtt / Unité :"}
                      </span>
                      <div className="inputForm w-[80%]">
                        <input
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          type="number"
                          name="unity"
                          value={QuantityUnity}
                          min={0}
                          onChange={handleQuantityUnityChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "إنذار المخزون :" : "Alerte Stock :"}
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
                        name="stock"
                        value={LimitedQuantity}
                        min={0}
                        onChange={handleLimitedQuantityChange}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "تحديد كمية البيع للزبون :"
                        : "Limite quantité vendue pour client :"}
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
                        name="stock"
                        value={Destocking}
                        min={0}
                        onChange={handleDestockingChange}
                      />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "تاريخ انتهاء الصلاحية :"
                        : "Date d'expiration :"}
                    </span>
                    <div className="inputForm">
                      <input
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        type="date"
                        name="ExparationDate"
                        value={ExparationDate}
                        onChange={handleExparationDateChange}
                      />
                    </div>
                  </div>
                  <div className="items-center">
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "طريقة الشراء :"
                        : "Méthode d'achat :"}
                    </span>

                    <div
                      className={`flex items-center space-x-2 mt-3 ${
                        language === "ar" ? "gap-x-8" : ""
                      }`}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={productState.buyingByUnit}
                            onChange={handleCheckboxChange}
                            name="buyingByUnit"
                          />
                        }
                        label={
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "شراء بالوحدة"
                              : "Achat par unité"}
                          </span>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={productState.buyingByBox}
                            onChange={handleCheckboxChange}
                            name="buyingByBox"
                          />
                        }
                        label={
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "شراء بالكرتون"
                              : "Achat par carton"}
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-0 ${
                    language === "ar" ? "gap-x-4" : ""
                  }`}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={productState.addToProposedList}
                        onChange={handleCheckboxChange}
                        name="addToProposedList"
                      />
                    }
                  />
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar"
                      ? "إضافة إلى القائمة المقترحة"
                      : "Ajouter à la liste proposée"}
                  </span>
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
                  onClick={handleCloseModal}
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={handleSaveStock}
                >
                  {language === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </div>
            </div>
          </>
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
