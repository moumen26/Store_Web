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
  handleOpenDialog,
  language,
}) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        {isEditing ? (
          <input
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            type="text"
            value={selling}
            onChange={(e) => setSelling(e.target.value)}
            className="editable-input"
          />
        ) : (
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {data?.selling} {language === "ar" ? "دج" : "DA"}
          </span>
        )}
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        {isEditing ? (
          <select
            value={buyingMathode}
            onChange={(e) => setBuyingMathode(e.target.value)}
            className="editable-input"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            <option value="">
              {language === "ar" ? "اختر طريقة" : "Select a method"}
            </option>
            <option value="both">
              {language === "ar" ? "كلاهما" : "Both"}
            </option>
            <option value="unity">
              {language === "ar" ? "الوحدة" : "Unity"}
            </option>
            <option value="box">{language === "ar" ? "الصندوق" : "Box"}</option>
          </select>
        ) : (
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {data?.buyingMathode}
          </span>
        )}
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        {isEditing ? (
          <input
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            type="text"
            value={quantityLimit}
            onChange={(e) => setQuantityLimit(e.target.value)}
            className="editable-input"
          />
        ) : (
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {data?.quantityLimit}
          </span>
        )}
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        {isEditing ? (
          <input
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            type="text"
            value={destocking}
            onChange={(e) => setDestocking(e.target.value)}
            className="editable-input"
          />
        ) : (
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {data?.destocking}
          </span>
        )}
      </TableCell>
      <TableCell align="right" className="tableCell w-[100px]">
        <div
          className="flex items-center justify-end space-x-3"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          {isEditing ? (
            <div
              className={`flex justify-end space-x-4 ${
                language === "ar" ? "gap-x-4" : ""
              }`}
            >
              <button
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={handleOpenDialog}
              >
                {language === "ar" ? "حفظ" : "Save"}
              </button>
              <button
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={onCancelClick}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
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
  handleRefetchDataChange,
  language,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [selling, setSelling] = useState("");
  const [buyingMathode, setBuyingMathode] = useState("");
  const [quantityLimit, setQuantityLimit] = useState("");
  const [destocking, setDestocking] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const clearFealds = () => {
    setSelling("");
    setBuyingMathode("");
    setQuantityLimit("");
    setDestocking("");
  };

  const [isEditing, setIsEditing] = useState(false);
  const onEditClick = () => {
    setIsEditing((prev) => !prev);
  };
  const onCancelClick = () => {
    setIsEditing(false);
    clearFealds();
  };

  const [
    openUpdateStockConfirmationDialog,
    setOpenUpdateStockConfirmationDialog,
  ] = useState(false);
  const handleCloseDialog = () => {
    setOpenUpdateStockConfirmationDialog(false);
    clearFealds();
  };
  const handleOpenDialog = () => {
    setOpenUpdateStockConfirmationDialog(true);
  };
  //save Stock API
  const handleUpdateStock = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Stock/update/basic/${decodedToken.id}/${data?._id}`,
        {
          QuantityLimit: quantityLimit,
          Destockage: destocking,
          BuyingMathode: buyingMathode,
          SellingPrice: selling,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setIsEditing(false);
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
                {language === "ar" ? "سعر البيع" : "Prix de vente"}
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
                {language === "ar" ? "طريقة الشراء" : "Méthode d'achat"}
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
                {language === "ar" ? "الكمية المحدودة" : "Quantité limite"}
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
                {language === "ar" ? "التخفيض" : "Déstockage"}
              </span>
            </TableCell>
            <TableCell>
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
            language={language}
          />
        </TableBody>
      </Table>
      <ConfirmDialog
        open={openUpdateStockConfirmationDialog}
        onConfirm={handleUpdateStock}
        onClose={handleCloseDialog}
        isloading={submitionLoading}
        language={language}
        dialogTitle={
          language === "ar"
            ? "تأكيد تحديث تفاصيل المخزون"
            : "Confirmation de la mise à jour du stock"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تحديث تفاصيل المخزون؟"
            : "Êtes-vous sûr de vouloir mettre à jour les détails du stock ?"
        }
      />
    </TableContainer>
  );
}
