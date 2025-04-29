import React, { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "react-modal";
import Search from "./Search";
import ButtonAdd from "./ButtonAdd";
import ConfirmDialog from "./ConfirmDialog";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Alert, Snackbar } from "@mui/material";
import ProductContainerPurchaseAddReturns from "./ProductContainerPurchaseAddReturns";

function AddPurchaseRetunsTableDetails({
  productsListToUpdate,
  setProductsListToUpdate,
  language,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Store selected products here
  const [newProduct, setNewProduct] = useState(null); // To store currently selected product
  const [unitType, setUnitType] = useState("perUnit"); // Default to "perUnit"
  const [addReturnsModal, setAddReturnsModal] = useState(false);

  // For the confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [ClientQuantity, setClientQuantity] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for closing the modal
  const handleCloseReturnsModal = () => {
    setAddReturnsModal(false);
    setNewProduct(null); // Reset selected product when modal closes
    setClientQuantity(0); // Reset quantity when modal closes
    setUnitType("perUnit"); // Reset unit type
  };

  // Handler for product selection via radio button
  const handleSelectProduct = (product) => {
    setNewProduct(product);
  };

  // Handler for quantity input change
  const handleProductQuantityChange = (e) => {
    setClientQuantity(e.target.value);
  };

  // Add selected product to the table
  const handleAddItem = () => {
    //check if the selected product is already in the list
    const isProductExist = products.find(
      (product) => product._id === newProduct._id
    );
    if (isProductExist) {
      setAlertMessage(
        language === "ar"
          ? "المنتج موجود بالفعل في القائمة"
          : "Le produit existe déjà dans la liste"
      );
      setAlertType("error");
      setSnackbarOpen(true);
    } else if (!newProduct) {
      setAlertMessage(
        language === "ar"
          ? "الرجاء اختيار منتج"
          : "Veuillez sélectionner un produit"
      );
      setAlertType("error");
      setSnackbarOpen(true);
    } else {
      let newQuantity = ClientQuantity;
      if (unitType == "perBox") {
        newQuantity =
          newQuantity * Number(newProduct.sousStock.stock.product.boxItems);
      }
      if (!newQuantity || newQuantity <= 0) {
        setAlertMessage(
          language === "ar"
            ? "يجب أن تكون الكمية أكبر من 0"
            : "La quantité doit être supérieure à 0"
        );
        setAlertType("error");
        setSnackbarOpen(true);
      } else if (newQuantity > newProduct.quantity) {
        setAlertMessage(
          language === "ar"
            ? "يجب أن تكون الكمية أقل من الكمية المتاحة"
            : "La quantité doit être inférieure à la quantité disponible"
        );
        setAlertType("error");
        setSnackbarOpen(true);
      } else {
        const newItem = {
          ...newProduct,
          newQuantity: newQuantity,
          unitType,
        };
        setProducts([...products, newItem]);
        setProductsListToUpdate([
          ...productsListToUpdate,
          {
            sousStock: newItem._id,
            quantity: newItem.newQuantity,
          },
        ]);
        handleCloseReturnsModal();
      }
    }
  };

  // Open the confirm dialog
  const handleOpenConfirmDialog = (index) => {
    setRowToDelete(index);
    setConfirmDialogOpen(true);
  };

  // Confirm deletion of a row
  const handleConfirmDelete = () => {
    if (rowToDelete !== null) {
      setProducts(products.filter((_, index) => index !== rowToDelete));
      setProductsListToUpdate(
        productsListToUpdate.filter((_, index) => index !== rowToDelete)
      );
      setConfirmDialogOpen(false);
    }
  };

  // Cancel deletion of a row
  const handleCancelDelete = () => {
    setRowToDelete(null);
    setConfirmDialogOpen(false);
  };

  // Table row component to display product details
  const OrderRow = ({ row, index }) => {
    const productAmount = Number(row.price) * Number(row.newQuantity);
    const newQuantity = Number(row.quantity) - Number(row.newQuantity);
    const totalAmount = Number(row.price) * Number(newQuantity);
    return (
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
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
            {row.sousStock.stock.product.name}{" "}
            {row.sousStock.stock.product.size}
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
            {row.sousStock.stock.product.brand.name}
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
            {row.price} {language === "ar" ? "دج " : " DA"}
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
            - {row.newQuantity}{" "}
            {language === "ar"
              ? row.newQuantity === 1
                ? "وحدة"
                : "وحدات"
              : row.newQuantity === 1
              ? "unité"
              : "unités"}
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
            {newQuantity}{" "}
            {language === "ar"
              ? newQuantity === 1
                ? "وحدة"
                : "وحدات"
              : newQuantity === 1
              ? "unité"
              : "unités"}
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
            - {productAmount} {language === "ar" ? "دج " : " DA"}
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
            {totalAmount} {language === "ar" ? "دج " : " DA"}
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
              onClick={() => handleOpenConfirmDialog(index)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ direction: language === "ar" ? "rtl" : "ltr" }}>
      <div className="flex justify-between items-center mb-[16px]">
        <h2
          className="customerClassTitle"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "إضافة مرتجعات" : "Ajouter des retours"}
        </h2>
        <ButtonAdd
          showIcon={true}
          language={language}
          buttonSpan={language === "ar" ? "إضافة عنصر" : "Ajouter un article"}
          onClick={() => setAddReturnsModal(true)}
        />
      </div>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table>
          <TableHead className="tableHead">
            <TableRow>
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
                  {language === "ar" ? "السعر" : "Prix"}
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
                  {language === "ar" ? "كمية الاسترجاع" : "Quantité retournée"}
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
                  {language === "ar" ? "الكمية الجديدة" : "Nouvelle quantité"}
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
                  {language === "ar" ? "مبلغ الاسترجاع" : "Montant retourné"}
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
                  {language === "ar" ? "المبلغ الجديد" : "Nouveau montant"}
                </span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span
                  className="thTableSpan"
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
            {products.length > 0 ? (
              products.map((row, index) => (
                <OrderRow
                  key={index}
                  row={row}
                  index={index}
                  language={language}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <span
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar"
                      ? "إضافة منتجات"
                      : "Ajouter des produits"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={addReturnsModal}
        onRequestClose={handleCloseReturnsModal}
        contentLabel={
          language === "ar" ? "إضافة مرتجعات" : "Ajouter des retours"
        }
        className="addNewModal addNewStockModal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        <div
          className="customerClass space-y-0"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <h2
            className="dialogTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إضافة مرتجعات للشراء"
              : "Ajouter des retours à l'achat"}
          </h2>
          <div className="space-y-[24px]">
            <div className="addProductModalHeader">
              <Search
                placeholder={
                  language === "ar"
                    ? "البحث عن المنتج..."
                    : "Rechercher un produit..."
                }
                value={searchQuery}
                onChange={handleSearchChange}
                language={language}
              />
              <div className="flex space-x-5 items-center">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الفئة :" : "Catégorie :"}
                </span>
                <div className="selectStoreWilayaCommune w-[300px]">
                  <select
                    name="productCategory"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  ></select>
                </div>
              </div>
            </div>
            <div className="h-fit">
              <ProductContainerPurchaseAddReturns
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
                language={language}
              />
            </div>

            <div className="flex flex-col space-y-2 mb-4">
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "نوع الوحدة :" : "Type d'unité :"}
                </span>
                <RadioGroup
                  aria-label="unit-type"
                  name="unit-type"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                >
                  <div className="w-[500px]">
                    <FormControlLabel
                      value="perUnit"
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#0d3a71" },
                          }}
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
                          {language === "ar" ? "لكل وحدة" : "Par unité"}
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="perBox"
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#0d3a71" },
                          }}
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
                          {language === "ar" ? "لكل علبة" : "Par boîte"}
                        </span>
                      }
                    />
                  </div>
                </RadioGroup>
              </div>
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الكمية :" : "Quantité :"}
                </span>
                <div className="inputForm">
                  <input
                    type="number"
                    name="productQuantity"
                    value={ClientQuantity}
                    min={0}
                    onChange={handleProductQuantityChange}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex justify-end ${
                language === "ar" ? "gap-x-8" : "space-x-8"
              }`}
            >
              <button
                onClick={handleCloseReturnsModal}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "إغلاق" : "Fermer"}
              </button>
              <button
                onClick={handleAddItem}
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "تأكيد" : "Confirmer"}
              </button>
            </div>
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: language === "ar" ? "left" : "right",
            }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={alertType}>
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {alertMessage}
              </span>
            </Alert>
          </Snackbar>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        dialogTitle={
          language === "ar" ? "تأكيد الحذف" : "Confirmer la suppression"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد حذف هذا العنصر؟"
            : "Êtes-vous sûr de vouloir supprimer cet article ?"
        }
        language={language}
      />
    </div>
  );
}

export default AddPurchaseRetunsTableDetails;
