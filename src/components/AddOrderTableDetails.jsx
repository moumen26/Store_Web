import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Dialog from "@mui/material/Dialog";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Search from "./Search";
import ProductsContainerAddOrder from "./ProductContainerAddOrder";

function AddOrderTableDetails({
  openModal,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
  setAPIProducts
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [rows, setRows] = useState([]);
  const [ClientQuantity, setClientQuantity] = useState(0);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [newItem, setNewItem] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [deletedProductName, setDeletedProductName] = useState("");
  const [unitType, setUnitType] = useState("perUnit");

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.ClientQuantity * row.product.selling,
        0
      );
      const total = Number(subtotal) + Number(deliveryAmount);
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  const handleDeleteClick = (uniqueId) => {
    setDeleteItemId(uniqueId);
    const deletedProduct = rows.find((row) => row.uniqueId === uniqueId);
    setDeletedProductName(deletedProduct.product.product.name);
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
    if (!newItem || !newItem.product._id) {
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
  
    if (unitType === "perBox") {
      productQuantity = Number(productQuantity) * Number(newItem.product.product.boxItems);
    }
  
    // Update newItem with the correct ClientQuantity
    const updatedItem = {
      ...newItem,
      ClientQuantity: productQuantity,
      uniqueId: Date.now().toString()
    };

    // Add the updated item to the rows
    setRows([...rows, updatedItem]);
    setAPIProducts((prevState) => ([
      ...prevState,
      {
        stock: updatedItem.product._id,
        quantity: updatedItem.ClientQuantity,
        price: updatedItem.product.selling,
      }
    ]));
  
    handleCloseModal();
    setNewItem(null);
    setClientQuantity(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectProduct = (product) => {
    setNewItem((prevState) => ({
      ...prevState,
      product: product,
    }));
  };
  const handleProductQuantityChange = (e) => {
    const value = e.target.value;
    setClientQuantity(value);
  };

  const OrderRow = ({
    row,
    onDelete,
  }) => {

    const productAmount = row.product.selling * row.ClientQuantity;

    return (
      <TableRow
        key={row.product._id}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product._id}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.product.name + ' ' + row.product.product.size}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.product.brand?.name}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.ClientQuantity}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.selling} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{productAmount} DA</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex items-center justify-end space-x-3">
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => onDelete(row.uniqueId)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };



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
              <TableCell className="tableCell">
                <span className="thTableSpan">Product_ID</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Product</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Brand</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Quantity</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Price</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Amount</span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan pr-1">Action</span>
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
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {rows.length === 0 ? (
                    <span>Add products</span>
                  ) : (
                    <CircularProgress size={24} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <div className="dialogAdd">
          <div className="flex items-center space-x-3 title">
            <h2 className="dialogTitle">Add Product to the Order</h2>
          </div>
          <div className="space-y-[24px] p-[20px]">
            <Search
              placeholder="Search by Product..."
              onChange={handleSearchChange}
            />
            <div className="h-[55vh]">
              <ProductsContainerAddOrder
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
              />
            </div>
            <div className="flex flex-col space-y-2 mb-4">
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span>Unit Type :</span>
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
                            "&.Mui-checked": { color: "#26667e" },
                          }}
                        />
                      }
                      label={<span>Per Unit</span>}
                    />
                    <FormControlLabel
                      value="perBox"
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#26667e" },
                          }}
                        />
                      }
                      label={<span>Per Box</span>}
                    />
                  </div>
                </RadioGroup>
              </div>
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span>Quantity :</span>
                <div className="inputForm">
                  <input
                    type="number"
                    name="productQuantity"
                    value={ClientQuantity}
                    min={0}
                    onChange={handleProductQuantityChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
            <button
              onClick={handleCloseModal}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              Close
            </button>
            <button
              onClick={handleAddItem}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        dialogTitle="Confirm Delete"
        dialogContentText={`Are you sure you want to delete ${deletedProductName}?`}
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
