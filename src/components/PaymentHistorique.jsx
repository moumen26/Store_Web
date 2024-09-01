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
    if (!isNaN(value) || value === "") {
      onChange(field, value);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.date}</span>
      </TableCell>

      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="number"
            value={editedHistorique.pendingPayment}
            onChange={(e) =>
              handleNumericChange("pendingPayment", e.target.value)
            }
            className="editable-input w-[100px]"
            min="0"
          />
        ) : (
          <span className="trTableSpan">{historique.pendingPayment} DA</span>
        )}
      </TableCell>

      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.remainingAmount} DA</span>
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
  historique: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    pendingPayment: PropTypes.number.isRequired,
    remainingAmount: PropTypes.number.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  editedHistorique: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

// Main component
export default function PaymentHistorique() {
  const [historiqueData, setHistoriqueData] = useState([
    {
      id: 1,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1500,
      remainingAmount: 100,
    },
    {
      id: 2,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1450,
      remainingAmount: 200,
    },
    {
      id: 3,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1550,
      remainingAmount: 150,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
    {
      id: 4,
      date: "Août 11, 2024 at 20:00",
      pendingPayment: 1600,
      remainingAmount: 120,
    },
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editedHistorique, setEditedHistorique] = useState({});

  const handleEditClick = (historique) => {
    setIsEditing(historique.id);
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

  const handleDeleteClick = (historique) => {
    setHistoriqueData((prevData) =>
      prevData.filter((item) => item.id !== historique.id)
    );
  };

  return (
    <TableContainer component={Paper} style={{ boxShadow: "none" }}>
      <Table aria-label="product historique">
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="thTableSpan">Date</span>
            </TableCell>

            <TableCell>
              <span className="thTableSpan">Pending Payment</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Remaining Amount</span>
            </TableCell>

            <TableCell align="right">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historiqueData.map((historique) => (
            <ProductHistoriqueRow
              key={historique.id}
              historique={historique}
              isEditing={isEditing === historique.id}
              onEditClick={() => handleEditClick(historique)}
              onSaveClick={handleSaveClick}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
              editedHistorique={editedHistorique}
              onDeleteClick={() => handleDeleteClick(historique)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
