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
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Search from "./Search";
import ProductsContainer from "./ProductsContainer";

function AddOrderTableDetails({
  openModal,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [rows, setRows] = useState([
    {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productQuantity: 5,
      productPrice: 120,
    },
    {
      productId: "0920490",
      productName: "Pril Isis - 650ml",
      productBrand: "Pril",
      productQuantity: 5,
      productPrice: 190,
    },
  ]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [newItem, setNewItem] = useState({
    productId: "",
    productName: "",
    productBrand: "",
    productQuantity: 0,
    productPrice: 0,
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedProductName, setDeletedProductName] = useState("");

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.productQuantity * row.productPrice,
        0
      );
      const total = subtotal + deliveryAmount;
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  const handleEditClick = (productId) => {
    setEditingRowId(productId);
    const rowToEdit = rows.find((row) => row.productId === productId);
    setEditedRow(rowToEdit);
  };

  const handleSaveClick = (productId) => {
    setRows(rows.map((row) => (row.productId === productId ? editedRow : row)));
    setEditingRowId(null);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleChange = (productId, field, value) => {
    if (field === "productQuantity" && (value <= 0 || isNaN(value))) {
      return;
    }
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (productId) => {
    const productToDelete = rows.find((row) => row.productId === productId);
    setDeleteItemId(productId);
    setDeletedProductName(productToDelete.productName);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setRows(rows.filter((row) => row.productId !== deleteItemId));
    setIsConfirmDialogOpen(false);
    setDeleteItemId(null);
    setSnackbarOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setDeleteItemId(null);
  };

  const handleAddItem = () => {
    setRows([...rows, newItem]);
    handleCloseModal();
    setNewItem({
      productId: "",
      productName: "",
      productBrand: "",
      productQuantity: 0,
      productPrice: 0,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectProduct = (product) => {
    setNewItem({
      productId: product.id,
      productName: product.name,
      productBrand: product.brand,
      productQuantity: newItem.productQuantity,
      productPrice: product.price,
    });
  };

  const OrderRow = ({
    row,
    isEditing,
    onEditClick,
    onSaveClick,
    onCancelClick,
    onChange,
    editedRow,
    onDelete,
  }) => {
    const handleNumericChange = (field, value) => {
      const numericValue = Number(value);
      if (numericValue > 0) {
        onChange(row.productId, field, numericValue);
      }
    };

    const productAmount = row.productPrice * row.productQuantity;

    return (
      <TableRow
        key={row.productId}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.productId}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.productName}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.productBrand}</span>
        </TableCell>
        <TableCell className="tableCell">
          {isEditing ? (
            <input
              type="number"
              value={editedRow.productQuantity}
              onChange={(e) =>
                handleNumericChange("productQuantity", e.target.value)
              }
              min="1"
              className="editable-input inputBoxes"
            />
          ) : (
            <span className="trTableSpan">{row.productQuantity}</span>
          )}
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.productPrice} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{productAmount} DA</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex items-center justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  className="text-green-500 cursor-pointer hover:text-green-700"
                  onClick={() => onSaveClick(row.productId)}
                >
                  Save
                </button>
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => onCancelClick()}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <PencilIcon
                  className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => onEditClick(row.productId)}
                />
                <TrashIcon
                  className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => onDelete(row.productId)}
                />
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
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
        </div>
        <div className="flex-col space-y-[16px] p-[20px]">
          <Search
            placeholder="Search by Product..."
            onChange={handleSearchChange}
          />
          <div className='h-[60vh] '>
            <ProductsContainer
              searchQuery={searchQuery}
              onSelectProduct={handleSelectProduct}
            />
          </div>
          <div className="dialogAddCustomerItem space-x-4 items-center justify-end">
            <span>Quantity</span>
            <div className="inputForm">
              <input
                type="number"
                name="customerFirstName"
                value={newItem.productQuantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    productQuantity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseModal}
            color="primary"
          >
            Close
          </button>
          <button
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={handleAddItem}
            color="primary"
          >
            Confirm
          </button>
        </div>
      </Dialog>

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
                  key={row.productId}
                  row={row}
                  isEditing={row.productId === editingRowId}
                  onEditClick={handleEditClick}
                  onSaveClick={handleSaveClick}
                  onCancelClick={handleCancelClick}
                  onChange={handleChange}
                  editedRow={editedRow}
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

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        dialogTitle="Confirm Delete"
        dialogContentText={`Are you sure you want to delete ${deletedProductName}?`}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Product {deletedProductName} deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddOrderTableDetails;
