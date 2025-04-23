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
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from "@mui/material";
import { formatDate } from "../util/useFullFunctions";

function ProductHistoriqueRow({
  historique,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onChange,
  editedHistorique,
  onDeleteClick,
  language,
}) {
  const handleNumericChange = (field, value) => {
    if (!isNaN(value) || value != "") {
      onChange(field, value);
    }
  };

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
          {historique.buying} {language === "ar" ? "دج" : "DA"}
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
          {historique.selling} {language === "ar" ? "دج" : "DA"}
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
          {historique.quantity}
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
          {historique.exparationDate ? historique.exparationDate : "/"}
        </span>
      </TableCell>
      <TableCell align="right" className="tableCell w-[100px]">
        <div
          className="flex items-center justify-end space-x-3"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <TrashIcon
            className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
            onClick={onDeleteClick}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

ProductHistoriqueRow.propTypes = {
  historique: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  editedHistorique: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

// Main component
export default function ProductHistorique({
  StockStatusData,
  StockStatusLoading,
  handleOpenStockStatusConfirmationDialog,
  language,
}) {
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(null);
  const [editedHistorique, setEditedHistorique] = useState({});

  const handleEditClick = (historique) => {
    setIsEditing(historique._id);
    setEditedHistorique({ ...historique });
  };

  const handleSaveClick = () => {
    setHistoriqueData((prevData) =>
      prevData.map((item) => (item.id === isEditing ? editedHistorique : item))
    );
    setIsEditing(null);
  };

  const handleCancelClick = () => {
    setIsEditing(null);
  };

  const handleChange = (field, value) => {
    setEditedHistorique((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDeleteClick = (historique) => {};

  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none", width: "100%" }}
    >
      <Table aria-label="product historique">
        <TableHead>
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
                {language === "ar" ? "التاريخ" : "Date"}
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
                {language === "ar" ? "سعر الشراء" : "Prix d'achat"}
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
                {language === "ar"
                  ? "تاريخ انتهاء الصلاحية"
                  : "Date d'expiration"}
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
          {StockStatusLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !StockStatusData || StockStatusData.length <= 0 ? (
            <TableRow>
              <TableCell className="thTableSpan" colSpan={6} align="center">
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "لا توجد بيانات متاحة"
                    : "Aucune donnée disponible"}
                </span>
              </TableCell>
            </TableRow>
          ) : (
            StockStatusData?.map((historique) => (
              <ProductHistoriqueRow
                key={historique._id}
                historique={historique}
                isEditing={isEditing === historique._id}
                onEditClick={() => handleEditClick(historique)}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
                onChange={handleChange}
                editedHistorique={editedHistorique}
                onDeleteClick={() =>
                  handleOpenStockStatusConfirmationDialog(historique._id)
                }
                language={language}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ProductHistorique.propTypes = {
  StockStatusData: PropTypes.array.isRequired,
  StockStatusLoading: PropTypes.bool.isRequired,
  handleOpenStockStatusConfirmationDialog: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
