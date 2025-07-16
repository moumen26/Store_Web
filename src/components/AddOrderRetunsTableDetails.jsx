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
import ProductContainerOrderAddReturns from "./ProductContainerOrderAddReturns";
import ButtonAdd from "./ButtonAdd";
import ConfirmDialog from "./ConfirmDialog";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Alert, Snackbar } from "@mui/material";

function AddOrderRetunsTableDetails({
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
      (product) => product.product._id === newProduct.product._id
    );
    if (isProductExist) {
      setAlertMessage("Product already exists in the list");
      setAlertType("error");
      setSnackbarOpen(true);
    } else if (!newProduct) {
      setAlertMessage("Please select a product");
      setAlertType("error");
      setSnackbarOpen(true);
    } else {
      let newQuantity = ClientQuantity;
      if (unitType == "perBox") {
        newQuantity = newQuantity * Number(newProduct.product.boxItems);
      }
      if (!newQuantity || newQuantity <= 0) {
        setAlertMessage("Quantity must be greater than 0");
        setAlertType("error");
        setSnackbarOpen(true);
      } else if (newQuantity > newProduct.quantity) {
        setAlertMessage("Quantity must be less than the available quantity");
        setAlertType("error");
        setSnackbarOpen(true);
      } else {
        const newItem = {
          ...newProduct,
          newQuantity: newQuantity,
          unitType, // Add unit type to the product
        };
        setProducts([...products, newItem]);
        setProductsListToUpdate([
          ...productsListToUpdate,
          {
            stock: newItem.stock,
            product: newItem.product._id,
            quantity: newItem.newQuantity,
          },
        ]);
        handleCloseReturnsModal(); // Close modal after adding product
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
            {row.product.name} {row.product.size}
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
            {row.product.brand.name}
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
            {row.price}
            {language === "ar" ? "دج " : " DA"}
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
                ? "قطعة"
                : "قطع"
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
            {" "}
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
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-4 sm:gap-y-0 mb-4 sm:mb-6">
        <h2
          className="customerClassTitle text-lg md:text-xl"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar" ? "إضافة مرتجعات" : "Ajouter des retours"}
        </h2>
        <ButtonAdd
          language={language}
          showIcon={true}
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
        // className="addNewModal addNewStockModal "
        className="addNewModal addNewCustomerModal max-h-[90vh] overflow-y-auto"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        <div
          className="customerClass space-y-0 px-4 md:px-6 py-4 md:py-6"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <h2
            className="dialogTitle text-lg md:text-xl mb-4 md:mb-6"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "إضافة مرتجعات للطلب"
              : "Ajouter des retours à la commande"}
          </h2>
          <div className="space-y-4 md:space-y-6">
            <div className="addProductModalHeader flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5 items-stretch md:items-center">
              <div className="w-full md:flex-1">
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
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-5 sm:items-center space-y-2 sm:space-y-0">
                <span
                  className="text-sm md:text-base"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الفئة :" : "Catégorie :"}
                </span>
                <div className="selectStoreWilayaCommune w-full sm:w-[200px] md:w-[300px]">
                  <select
                    name="productCategory"
                    className="w-full"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  ></select>
                </div>
              </div>
            </div>

            <div className="h-fit">
              <ProductContainerOrderAddReturns
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
                language={language}
              />
            </div>

            <div className="flex flex-col space-y-4 mb-4">
              <div className="dialogAddCustomerItem flex flex-col md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
                <span
                  className="text-sm md:text-base"
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
                  <div className="w-full md:w-[500px] flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
                          className="text-sm md:text-base"
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
                          className="text-sm md:text-base"
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

              <div className="dialogAddCustomerItem flex flex-col md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
                <span
                  className="text-sm md:text-base"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الكمية :" : "Quantité :"}
                </span>
                <div className="inputForm w-full md:w-auto">
                  <input
                    type="number"
                    name="productQuantity"
                    value={ClientQuantity}
                    min={0}
                    onChange={handleProductQuantityChange}
                    className="w-full md:w-auto px-3 py-2 text-sm md:text-base"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  />
                </div>
              </div>
            </div>

             <div
              className={`flex flex-col sm:flex-row ${
                language === "ar" ? "sm:gap-x-8" : "sm:space-x-8"
              } gap-y-4 sm:gap-y-0 justify-end`}
            >
              <button
                onClick={handleCloseReturnsModal}
                className="text-gray-500 cursor-pointer hover:text-gray-700 px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg sm:border-none sm:rounded-none sm:px-0 sm:py-0 order-2 sm:order-1"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "إغلاق" : "Fermer"}
              </button>
              <button
                onClick={handleAddItem}
                className="text-white bg-blue-500 hover:bg-blue-700 cursor-pointer px-4 py-2 text-sm md:text-base rounded-lg sm:text-blue-500 sm:bg-transparent sm:hover:bg-transparent sm:hover:text-blue-700 sm:px-0 sm:py-0 sm:rounded-none order-1 sm:order-2"
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
      />
    </div>
  );
}

export default AddOrderRetunsTableDetails;
