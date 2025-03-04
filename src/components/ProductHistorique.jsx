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
}) {
  const handleNumericChange = (field, value) => {
    if (!isNaN(value) || value != "") {
      onChange(field, value);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{formatDate(historique.date)}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.buying} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="number"
            value={editedHistorique.selling}
            onChange={(e) => handleNumericChange("selling", e.target.value)}
            className="editable-input w-[100px]"
            min="0"
          />
        ) : (
          <span className="trTableSpan">{historique.selling} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.quantity}</span>
      </TableCell>
      <TableCell className="tableCell">
        {/* {isEditing ? (
          <input
            type="text"
            value={editedHistorique.exparationDate}
            onChange={(e) => onChange("exparationDate", e.target.value)}
            className="editable-input"
          />
        ) : ( */}
        <span className="trTableSpan">
          {historique.exparationDate ? historique.exparationDate : "undefined"}
        </span>
        {/* )} */}
      </TableCell>
      <TableCell className="tableCell w-[100px]">
        <div className="flex items-center justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={onSaveClick}
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
              <TrashIcon
                className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                onClick={onDeleteClick}
              />
            </>
          )}
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
};

// Main component
export default function ProductHistorique({
  StockStatusData,
  StockStatusLoading,
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
    <TableContainer component={Paper} style={{ boxShadow: "none" }}>
      <Table aria-label="product historique">
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="thTableSpan">Date</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Selling Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Quantity</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Exparation Date </span>
            </TableCell>
            <TableCell align="right">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {StockStatusLoading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !StockStatusData || StockStatusData.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No Data Available
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
                onDeleteClick={() => handleDeleteClick(historique)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
