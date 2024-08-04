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
import ConfirmDialog from "./ConfirmDialog"; // Import your ConfirmDialog component

function AddOrderTableDetails({
  openModal,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
}) {
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
    setDeleteItemId(productId);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const productToDelete = rows.find((row) => row.productId === deleteItemId);
    setDeletedProductName(productToDelete.productName);
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
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table aria-label="collapsible table">
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
                  isEditing={editingRowId === row.productId}
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
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product ID"
            fullWidth
            variant="outlined"
            value={newItem.productId}
            onChange={(e) =>
              setNewItem({ ...newItem, productId: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={newItem.productName}
            onChange={(e) =>
              setNewItem({ ...newItem, productName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Brand"
            fullWidth
            variant="outlined"
            value={newItem.productBrand}
            onChange={(e) =>
              setNewItem({ ...newItem, productBrand: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={newItem.productQuantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                productQuantity: Number(e.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={newItem.productPrice}
            onChange={(e) =>
              setNewItem({ ...newItem, productPrice: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAddItem}>Add</Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deletedProductName}?`}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Product deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddOrderTableDetails;
