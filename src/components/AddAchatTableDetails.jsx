import React, { useState, useEffect, useRef, useMemo } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "react-modal";
import Search from "./Search";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ProductCard from "./ProductCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";
import { PhotoIcon } from "@heroicons/react/16/solid";
import ButtonAdd from "./ButtonAdd";
import { Radio, RadioGroup } from "@mui/material";
import { formatNumber } from "../util/useFullFunctions";
import axios from "axios";

function AddAchatTableDetails({
  isModalOpen,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
  setAPIProducts,
  discount,
  language,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [rows, setRows] = useState([]);
  const [newItem, setNewItem] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletedProductName, setDeletedProductName] = useState("");
  const [ClientQuantity, setClientQuantity] = useState(0);
  const [QuantityPerBox, setQuantityPerBox] = useState(0);
  const [QuantityPerUnity, setQuantityPerUnity] = useState(0);

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

  const clearProductFormFields = () => {
    setProductName("");
    setProductSize("");
    setProductBoxItems("");
    setProductBrand("");
    setProductCategory("");
    setImage(null);
    fileInputRef.current.value = null;
  };

  const handleQuantityPerBoxChange = (e) => {
    setQuantityPerBox(e.target.value);

    const boxQuantity = Number(
      Number(e.target.value) * Number(selectedProduct?.boxItems)
    );
    if (boxQuantity > 0)
      setClientQuantity(Number(boxQuantity) + Number(QuantityPerUnity));
    else setClientQuantity(Number(QuantityPerUnity));
  };
  const handleQuantityPerUnityChange = (e) => {
    setQuantityPerUnity(e.target.value);
    const boxQuantity = Number(
      Number(QuantityPerBox) * Number(selectedProduct?.boxItems)
    );
    if (boxQuantity > 0)
      setClientQuantity(Number(boxQuantity) + Number(e.target.value));
    else setClientQuantity(Number(e.target.value));
  };
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setNewItem((prevState) => ({
      ...prevState,
      product: product,
    }));
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const [buyingPrice, setBuyingPrice] = useState(0);
  const handleBuyingPriceChange = (e) => {
    setBuyingPrice(e.target.value);
  };

  const [sellingPrice, setSellingPrice] = useState(buyingPrice);
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
    clearProductFormFields();
  };

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.quantity * row.buying,
        0
      );
      const total = subtotal + deliveryAmount;
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  const handleDeleteClick = (uniqueId) => {
    setDeleteItemId(uniqueId);
    const deletedProduct = rows.find((row) => row.uniqueId === uniqueId);
    setDeletedProductName(deletedProduct.product.name);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedRows = rows.filter((row) => row.uniqueId !== deleteItemId);
    setRows(updatedRows);

    const updatedAPIProducts = updatedRows.map((updatedItem) => ({
      name: updatedItem.product.name,
      productID: updatedItem.productID,
      quantity: updatedItem.quantity,
      boxQuantity: updatedItem.boxQuantity,
      buying: updatedItem.buying,
      selling: updatedItem.selling,
    }));

    setAPIProducts(updatedAPIProducts);
    setIsConfirmDialogOpen(false);
    setDeletedProductName("");
    setDeleteItemId(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setDeleteItemId(null);
  };

  const handleAddItem = () => {
    if (!newItem || !newItem.product._id) {
      setAlertMessage("Please select a product.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    if (ClientQuantity <= 0 || buyingPrice <= 0 || sellingPrice <= 0) {
      setAlertMessage("Please enter a valid quantity and prices.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    if (Number(buyingPrice) > Number(sellingPrice)) {
      setAlertMessage(
        "The selling price must be higher than the buying price."
      );
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    const productQuantity =
      Number(ClientQuantity) / Number(newItem.product.boxItems);

    // Update newItem with the correct ClientQuantity
    const updatedItem = {
      ...newItem,
      name: newItem.product.name,
      quantity: ClientQuantity,
      boxQuantity: productQuantity,
      buying: buyingPrice,
      selling: sellingPrice,
      uniqueId: Date.now().toString(),
    };

    // Add the updated item to the rows
    setRows([...rows, updatedItem]);
    setAPIProducts((prevState) => [
      ...prevState,
      {
        name: updatedItem.product.name,
        productID: updatedItem.product._id,
        quantity: updatedItem.quantity,
        buying: buyingPrice,
        selling: sellingPrice,
      },
    ]);

    handleCloseModal();
    setNewItem(null);
    setQuantityPerBox(0);
    setQuantityPerUnity(0);
    setClientQuantity(0);
    setBuyingPrice(0);
    setSellingPrice(0);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const OrderRow = ({ row, onDelete, language }) => {
    const productAmount = Number(row.buying) * Number(row.quantity);

    return (
      <TableRow
        key={row.productId}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        {/* <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {row.product._id}
          </span>
        </TableCell> */}
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {row.product.name}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {row.product.brand.name}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {row.quantity}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {formatNumber(row.buying)}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="trTableSpan"
          >
            {formatNumber(productAmount)}
          </span>
        </TableCell>
        <TableCell
          align={language === "ar" ? "right" : "right"}
          className="tableCell w-[100px]"
        >
          <div
            className={`flex items-center ${
              language === "ar" ? "justify-start" : "justify-end"
            }`}
          >
            {" "}
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => onDelete(row.uniqueId)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  //---------------------------------API calls---------------------------------\\

  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
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
    data: CategoryData = [],
    error: CategoryError,
    isLoading: CategoryLoading,
    refetch: CategoryRefetch,
  } = useQuery({
    queryKey: ["CategoryData", user?.token],
    queryFn: fetchCategoryData,
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
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        handleRefetchDataChange();
        clearProductFormFields();
        setSubmitionLoading(false);
        handleCloseAddProductModal();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error creating product: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating product");
      }
    } finally{
      setSubmitionLoading(false);
    }
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

  // Filtering logic
  const filteredProducts = useMemo(() => {
    if (!ProductData) return [];

    return ProductData.filter((product) => {
      const matchesSearchQuery =
        product?.brand?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product?.category?._id == selectedCategory
        : true;

      return matchesSearchQuery && matchesCategory;
    });
  }, [ProductData, searchQuery, selectedCategory]);

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table>
          <TableHead className="tableHead">
            <TableRow>
              {/* <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "معرف المنتج" : "ID Produit"}
                </span>
              </TableCell> */}
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "المنتج" : "Produit"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "الماركة" : "Marque"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "الكمية" : "Quantité"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "السعر" : "Prix"}
                  <span className="text-[10px] align-baseline">
                    {language === "ar" ? "(دج)" : "(DA)"}
                  </span>
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan"
                >
                  {language === "ar" ? "المبلغ" : "Montant"}
                  <span className="text-[10px] align-baseline">
                    {language === "ar" ? "(دج)" : "(DA)"}
                  </span>
                </span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan pr-1"
                >
                  {language === "ar" ? "إجراء" : "Action"}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <OrderRow
                  key={row.productId}
                  row={row}
                  onDelete={handleDeleteClick}
                  language={language}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {rows.length === 0 ? (
                    <span
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      className="thTableSpan"
                    >
                      {language === "ar"
                        ? "إضافة منتجات"
                        : "Ajouter des produits"}
                    </span>
                  ) : (
                    <CircularProgress color="inherit" size={24} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel={
          language === "ar" ? "إضافة مخزون جديد" : "Ajouter un nouveau stock"
        }
        className="addNewModal addNewStockModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {ProductLoading || CategoryLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            <div
              className="customerClass addProductAchat"
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
                  ? "إضافة منتج إلى الشراء"
                  : "Ajouter un produit à l'achat"}
              </h2>
              <div className="addNewStockClass flex-col">
                <div className="w-full h-fit w-[100%]">
                  <div className="addProductToAchatButton">
                    <div className="addProductModalHeader">
                      <Search
                        placeholder={
                          language === "ar"
                            ? "ابحث عن المنتج..."
                            : "Rechercher un produit..."
                        }
                        value={searchQuery}
                        language={language}
                        onChange={handleSearchChange}
                      />
                      <div className="flex items-center">
                        <span
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "Cairo-Regular, sans-serif"
                                : "",
                          }}
                          className={`${language === "ar" ? "ml-5" : ""}`}
                        >
                          {language === "ar" ? "الفئة :" : "Catégorie :"}
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
                            {CategoryData ? (
                              <>
                                <option
                                  style={{
                                    fontFamily:
                                      language === "ar"
                                        ? "Cairo-Regular, sans-serif"
                                        : "",
                                  }}
                                  value=""
                                >
                                  {language === "ar"
                                    ? "-- اختر فئة المنتج --"
                                    : "-- Sélectionner une catégorie --"}
                                </option>
                                {CategoryData.map((category) => (
                                  <option
                                    style={{
                                      fontFamily:
                                        language === "ar"
                                          ? "Cairo-Regular, sans-serif"
                                          : "",
                                    }}
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option
                                style={{
                                  fontFamily:
                                    language === "ar"
                                      ? "Cairo-Regular, sans-serif"
                                      : "",
                                }}
                                value=""
                              >
                                {language === "ar"
                                  ? "لا توجد فئات متاحة"
                                  : "Aucune catégorie disponible"}
                              </option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <ButtonAdd
                      buttonSpan={
                        language === "ar"
                          ? "إضافة منتج جديد"
                          : "Ajouter un nouveau produit"
                      }
                      language={language}
                      onClick={handleOpenAddProductModal}
                    />
                  </div>

                  <div className="productsContainer p-0 mt-5 h-[90%]">
                    {filteredProducts?.length > 0 ? (
                      filteredProducts.map((product) => (
                        <ProductCard
                          language={language}
                          key={product._id}
                          productName={`${product.brand?.name} ${product.name} ${product.size}`}
                          productImage={`${
                            import.meta.env.VITE_APP_FILES_URL
                          }/${product.image}`}
                          onClick={() => handleSelectProduct(product)}
                          selected={
                            selectedProduct &&
                            product._id === selectedProduct._id
                          }
                        />
                      ))
                    ) : (
                      <p>
                        {language === "ar"
                          ? "لا توجد منتجات متاحة"
                          : "Aucun produit disponible"}
                      </p>
                    )}
                  </div>
                </div>
                {selectedProduct && (
                  <>
                    <div className="mt-8 w-[100%] productDetailsStockAdd">
                      <div className="flex flex-col space-y-3 mb-4 w-[50%]">
                        <div className="w-fit dialogAddCustomerItem items-center">
                          <span
                            className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {language === "ar"
                              ? "سعر الشراء :"
                              : "Prix d'achat :"}
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
                              value={buyingPrice}
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
                              className="ml-2"
                            >
                              {language === "ar" ? "دج" : "DA"}
                            </span>
                          </div>
                        </div>
                        <div className="w-fit dialogAddCustomerItem items-center">
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                            className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                          >
                            {language === "ar"
                              ? "سعر البيع :"
                              : "Prix de vente :"}
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
                              value={sellingPrice}
                              min={0}
                              onChange={handleSellingPriceChange}
                            />
                            <span
                              style={{
                                fontFamily:
                                  language === "ar"
                                    ? "Cairo-Regular, sans-serif"
                                    : "",
                              }}
                              className="ml-2"
                            >
                              {language === "ar" ? "دج" : "DA"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 mb-4 w-[50%]">
                        <div className="w-fit dialogAddCustomerItem items-center">
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                            className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                          >
                            {language === "ar"
                              ? "الكمية لكل صندوق :"
                              : "Quantité par boîte :"}
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
                              value={QuantityPerBox}
                              min={0}
                              onChange={handleQuantityPerBoxChange}
                            />
                          </div>
                        </div>
                        <div className="w-fit dialogAddCustomerItem items-center">
                          <span
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                            className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                          >
                            {language === "ar"
                              ? "الكمية لكل وحدة :"
                              : "Quantité par unité :"}
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
                              value={QuantityPerUnity}
                              min={0}
                              onChange={handleQuantityPerUnityChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-fit space-x-3 items-center">
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                      >
                        {language === "ar"
                          ? "إجمالي الكمية :"
                          : "Quantité totale :"}
                      </span>
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className={`${language === "ar" ? "ml-5" : "mr-5"}`}
                      >
                        {ClientQuantity} {language === "ar" ? "وحدة" : "unité"}
                      </span>
                    </div>
                    <div
                      className={`flex justify-end ${
                        language === "ar" ? "gap-x-8" : "space-x-8"
                      }`}
                    >
                      {" "}
                      <button
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={handleCloseModal}
                      >
                        {language === "ar" ? "إلغاء" : "Annuler"}
                      </button>
                      <button
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={handleAddItem}
                      >
                        {language === "ar" ? "حفظ" : "Enregistrer"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>

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
                        value={productName}
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
                        name="productSize"
                        value={productSize}
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
                        name="productBoxItems"
                        value={productBoxItems}
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
                        value={productCategory}
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
                        name="productBrand"
                        value={productBrand}
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

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        dialogTitle={
          language === "ar" ? "تأكيد الحذف" : "Confirmer la suppression"
        }
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد حذف ${deletedProductName}؟`
            : `Êtes-vous sûr de vouloir supprimer ${deletedProductName} ?`
        }
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddAchatTableDetails;
