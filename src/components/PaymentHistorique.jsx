import PropTypes from "prop-types";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDialog from "./ConfirmDialog";
import { Alert, Snackbar } from "@mui/material";
import { formatDate } from "../util/useFullFunctions";
import axios from "axios";
function ProductHistoriqueRow({
  historique,
  onDeleteClick,
  isClosed = false,
  language,
}) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
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
          {formatDate(historique.date)}
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
          {historique.amount} DA
        </span>
      </TableCell>
      {isClosed && (
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
              onClick={onDeleteClick}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

ProductHistoriqueRow.propTypes = {
  historique: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

// Main component
export default function PaymentHistorique({
  data,
  isClosed = false,
  id,
  user,
  language,
  decodedToken,
  refetchPurchaseData,
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deletedProductName, setDeletedProductName] = useState("");
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleDeleteClick = (historique) => {
    setDeleteItemId(historique._id);
    setDeletedProductName(historique.amount);
    setIsConfirmDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteItemId("");
    setDeletedProductName("");
    setIsConfirmDialogOpen(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  //delete payment API
  const handleOnConfirmDeletePayment = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.delete(
        import.meta.env.VITE_APP_URL_BASE +
          `/Purchase/payment/${decodedToken?.id}/${id}/${deleteItemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchPurchaseData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCancelDelete();
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
        console.error("Error deleting payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error deleting payment", error.message);
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper} style={{ boxShadow: "none" }}>
        <Table aria-label="product historique">
          <TableHead>
            <TableRow>
              <TableCell align={language === "ar" ? "right" : "left"}>
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "التاريخ" : "Date"}
                </span>
              </TableCell>
              <TableCell align={language === "ar" ? "right" : "left"}>
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "المبلغ" : "Montant"}
                </span>
              </TableCell>
              {isClosed && (
                <TableCell align="right">
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
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              [...data]
                .reverse()
                .map((historique) => (
                  <ProductHistoriqueRow
                    key={historique._id}
                    historique={historique}
                    onDeleteClick={() => handleDeleteClick(historique)}
                    isClosed={isClosed}
                    language={language}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {data.length == 0 ? (
                    <span
                      className="thTableSpan"
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "لا توجد مدفوعات متاحة"
                        : "Aucun paiement disponible"}
                    </span>
                  ) : (
                    <CircularProgress color="inherit" size={4} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleOnConfirmDeletePayment}
        onClose={handleCancelDelete}
        language={language}
        isloading={submitionLoading}
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
