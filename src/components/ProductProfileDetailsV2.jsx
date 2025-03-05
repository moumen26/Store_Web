import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import ConfirmDialog from "./ConfirmDialog";
import axios from "axios";

function ProductProfileRow({ 
  data, 
  isEditing,
  selling,
  setSelling,
  buyingMathode,
  setBuyingMathode,
  quantityLimit,
  setQuantityLimit,
  destocking,
  setDestocking,
  onCancelClick,
  onEditClick,
  handleOpenDialog
}) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={selling}
            onChange={(e) => setSelling(e.target.value)}
            className="editable-input"
          />
        ) : (
        <span className="trTableSpan">{data?.selling} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <select
            value={buyingMathode}
            onChange={(e) => setBuyingMathode(e.target.value)}
            className="editable-input"
          >
            <option value="">Select a method</option>
            <option value="both">Both</option>
            <option value="unity">Unity</option>
            <option value="box">Box</option>

          </select>
        ) : (
        <span className="trTableSpan">{data?.buyingMathode}</span>
        )} 
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={quantityLimit}
            onChange={(e) => setQuantityLimit(e.target.value)}
            className="editable-input"
          />
        ) : (
        <span className="trTableSpan">{data?.quantityLimit}</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={destocking}
            onChange={(e) => setDestocking(e.target.value)}
            className="editable-input"
          />
        ) : (
        <span className="trTableSpan">{data?.destocking}</span>
        )}
      </TableCell>
      <TableCell className="tableCell w-[100px]">
        <div className="flex items-center justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={handleOpenDialog}
              >
                Save
              </button>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={onCancelClick}
              >
                Cancel
              </button>
            </>
          ) : (
          <>
            <PencilIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={onEditClick}
            />
          </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ProductProfileDetailsV2({ 
  data,
  setAlertType,
  setSnackbarMessage,
  setSnackbarOpen,
  handleRefetchDataChange
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [selling, setSelling] = useState('');
  const [buyingMathode, setBuyingMathode] = useState('');
  const [quantityLimit, setQuantityLimit] = useState('');
  const [destocking, setDestocking] = useState('');
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const clearFealds = () => {
    setSelling('');
    setBuyingMathode('');
    setQuantityLimit('');
    setDestocking('');
  }

  const [isEditing, setIsEditing] = useState(false);
  const onEditClick = () => {
    setIsEditing((prev) => !prev);
  }
  const onCancelClick = () => {
    setIsEditing(false);
    clearFealds();
  }

  const [openUpdateStockConfirmationDialog, setOpenUpdateStockConfirmationDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenUpdateStockConfirmationDialog(false);
    clearFealds();
  }
  const handleOpenDialog = () => {
    setOpenUpdateStockConfirmationDialog(true);
  }
  //save Stock API
  const handleUpdateStock = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Stock/update/basic/${decodedToken.id}/${data?._id}`,
        {
          QuantityLimit: quantityLimit, 
          Destockage: destocking, 
          BuyingMathode: buyingMathode, 
          SellingPrice: selling
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
        handleCloseDialog();
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
        console.error("Error updating stock: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating stock", error);
      }
    }
  };
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="product profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">
              <span className="thTableSpan">Prix de vente</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Méthode d'achat</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Quantité limite</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Déstockage</span>
            </TableCell>
            <TableCell align="right">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ProductProfileRow 
            data={data} 
            isEditing={isEditing}
            selling={selling}
            setSelling={setSelling}
            buyingMathode={buyingMathode}
            setBuyingMathode={setBuyingMathode}
            quantityLimit={quantityLimit}
            setQuantityLimit={setQuantityLimit}
            destocking={destocking}
            setDestocking={setDestocking}
            onCancelClick={onCancelClick}
            onEditClick={onEditClick}
            handleOpenDialog={handleOpenDialog}
          />
        </TableBody>
      </Table>
      <ConfirmDialog
        open={openUpdateStockConfirmationDialog}
        onConfirm={handleUpdateStock}
        onClose={handleCloseDialog}
        dialogTitle={"Confirm update stock details"}
        dialogContentText={`Are you sure you want to update your stock details?`}
        isloading={submitionLoading}
      />
    </TableContainer>
  );
}
