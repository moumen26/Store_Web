import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { TrashIcon } from "@heroicons/react/24/outline";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Search from "./Search";
import Modal from "react-modal";
import ProductsContainerAddOrder from "./ProductContainerAddOrder";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "../util/useFullFunctions";

function AddOrderTableDetails({
  openModal,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
  setAPIProducts,
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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [deletedProductName, setDeletedProductName] = useState("");
  const [unitType, setUnitType] = useState("perUnit");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ClientQuantity, setClientQuantity] = useState(0);
  const [QuantityPerBox, setQuantityPerBox] = useState(0);
  const [QuantityPerUnity, setQuantityPerUnity] = useState(0);
  const handleQuantityPerBoxChange = (e) => {
    setQuantityPerBox(e.target.value);
    const boxQuantity = Number(
      Number(e.target.value) * Number(newItem?.product?.boxItems)
    );
    if (boxQuantity > 0)
      setClientQuantity(Number(boxQuantity) + Number(QuantityPerUnity));
    else setClientQuantity(Number(QuantityPerUnity));
  };
  const handleQuantityPerUnityChange = (e) => {
    setQuantityPerUnity(e.target.value);
    const boxQuantity = Number(
      Number(QuantityPerBox) * Number(newItem?.product?.boxItems)
    );
    if (boxQuantity > 0)
      setClientQuantity(Number(boxQuantity) + Number(e.target.value));
    else setClientQuantity(Number(e.target.value));
  };
  const handelCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.ClientQuantity * row.selling,
        0
      );
      const total = Number(subtotal) + Number(deliveryAmount);
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  useEffect(() => {
    if (newItem) {
      setQuantityPerBox(0);
      setQuantityPerUnity(0);
    }
  }, [newItem]);

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
      stock: updatedItem.product._id,
      quantity: updatedItem.ClientQuantity,
      price: updatedItem.product.selling,
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
    if (!newItem || !newItem._id) {
      setAlertMessage("Please select a product.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    let productQuantity = ClientQuantity;

    if (productQuantity <= 0) {
      setAlertMessage("Please enter a valid quantity.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    // Update newItem with the correct ClientQuantity
    const updatedItem = {
      ...newItem,
      ClientQuantity: productQuantity,
      uniqueId: Date.now().toString(),
    };

    // Add the updated item to the rows
    setRows([...rows, updatedItem]);
    setAPIProducts((prevState) => [
      ...prevState,
      {
        stock: updatedItem._id,
        quantity: updatedItem.ClientQuantity,
        price: updatedItem.selling,
      },
    ]);

    handleCloseModal();
    setNewItem(null);
    setClientQuantity(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectProduct = (product) => {
    setNewItem(product);
  };

  const OrderRow = ({ row, onDelete }) => {
    const productAmount = row.selling * row.ClientQuantity;

    return (
      <TableRow
        key={row._id}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        {/* <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row._id}
          </span>
        </TableCell> */}
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row.product.name + " " + row.product.size}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row.product.brand?.name}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row.ClientQuantity}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {formatNumber(row.selling)}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
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
    refetchOnWindowFocus: true, // enable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

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
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "معرف المنتج" : "ID Produit"}
                </span>
              </TableCell> */}
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "المنتج" : "Produit"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "العلامة التجارية" : "Marque"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الكمية" : "Quantité"}
                </span>
              </TableCell>
              <TableCell
                className="tableCell"
                align={language === "ar" ? "right" : "left"}
              >
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
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
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "المبلغ" : "Montant"}
                  <span className="text-[10px] align-baseline">
                    {language === "ar" ? "(دج)" : "(DA)"}
                  </span>
                </span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span
                  className="thTableSpan pr-1"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
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
                  key={row.uniqueId}
                  row={row}
                  onDelete={handleDeleteClick}
                  language={language}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {rows.length === 0 ? (
                    <span
                      className="thTableSpan"
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
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
        isOpen={openModal}
        onRequestClose={handleCloseModal}
        contentLabel={
          language === "ar"
            ? "إضافة منتج إلى الطلب"
            : "Ajouter un produit à la commande"
        }
        className="addNewModal addNewStockModal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div
          className="customerClass addProductAchat"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <h2
            className="dialogTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إضافة منتج إلى الطلب"
              : "Ajouter un produit à la commande"}
          </h2>
          <div className="space-y-[24px]">
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
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className={`${language === "ar" ? "ml-5" : ""}`}
                >
                  {language === "ar" ? "الفئة :" : "Catégorie :"}
                </span>
                <div className="selectStoreWilayaCommune w-[300px]">
                  <select
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                    name="productCategory"
                    onChange={handelCategoryChange}
                  >
                    <option
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      value=""
                      disabled
                      selected
                    >
                      {language === "ar"
                        ? "-- اختر فئة المنتج --"
                        : "-- Sélectionner une catégorie --"}
                    </option>
                    {CategoryData?.map((category) => (
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
                  </select>
                </div>
              </div>
            </div>
            <div className="h-fit">
              <ProductsContainerAddOrder
                language={language}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSelectProduct={handleSelectProduct}
              />
            </div>
            {newItem && (
              <div className="flexItemsCenterBetween">
                <div className="w-fit dialogAddCustomerItem items-center">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
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
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                      type="number"
                      name="stock"
                      value={QuantityPerUnity}
                      min={0}
                      onChange={handleQuantityPerUnityChange}
                    />
                  </div>
                </div>
                <div className="w-fit dialogAddCustomerItem items-center">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
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
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {ClientQuantity} {language === "ar" ? "وحدة" : "unité"}
                  </span>
                </div>
              </div>
            )}
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
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              onClick={handleCloseModal}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
              aria-label={language === "ar" ? "إغلاق" : "Fermer"}
            >
              {language === "ar" ? "إغلاق" : "Fermer"}
            </button>
            <button
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              onClick={handleAddItem}
              className={`cursor-pointer ${
                !newItem || ClientQuantity === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:text-blue-700"
              }`}
              aria-label={language === "ar" ? "تأكيد" : "Confirmer"}
              disabled={!newItem || ClientQuantity === 0}
            >
              {language === "ar" ? "تأكيد" : "Confirmer"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        dialogTitle={
          language === "ar" ? "تأكيد الحذف" : "Confirmation de la suppression"
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

export default AddOrderTableDetails;
