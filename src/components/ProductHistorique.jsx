import PropTypes from "prop-types";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// Row component
function ProductHistoriqueRow({ historique, onEditClick, onDeleteClick }) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell>
        <span className="trTableSpan">{historique.date}</span>
      </TableCell>
      <TableCell>
        <span className="trTableSpan">{historique.buyingPrice} DA</span>
      </TableCell>
      <TableCell>
        <span className="trTableSpan">{historique.sellPrice} DA</span>
      </TableCell>
      <TableCell>
        <span className="trTableSpan">{historique.quantity}</span>
      </TableCell>
      <TableCell>
        <span className="trTableSpan">{historique.supplier}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end space-x-3">
          <PencilIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => onEditClick(historique)}
          />
          <TrashIcon
            className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => onDeleteClick(historique)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

ProductHistoriqueRow.propTypes = {
  historique: PropTypes.shape({
    date: PropTypes.string.isRequired,
    buyingPrice: PropTypes.number.isRequired,
    sellPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    supplier: PropTypes.string.isRequired,
  }).isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

// Main component
export default function ProductHistorique() {
  const historiqueData = [
    {
      date: "Août 11, 2024 at 20:00",
      buyingPrice: 1200,
      sellPrice: 1500,
      quantity: 100,
      supplier: "Supplier A",
    },
    {
      date: "Août 11, 2024 at 20:00",
      buyingPrice: 1150,
      sellPrice: 1450,
      quantity: 200,
      supplier: "Supplier B",
    },
    {
      date: "Août 11, 2024 at 20:00",
      buyingPrice: 1250,
      sellPrice: 1550,
      quantity: 150,
      supplier: "Supplier C",
    },
    {
      date: "Août 11, 2024 at 20:00",
      buyingPrice: 1300,
      sellPrice: 1600,
      quantity: 120,
      supplier: "Supplier D",
    },

  ];

  const handleEditClick = (historique) => {
    console.log("Edit", historique);
  };

  const handleDeleteClick = (historique) => {
    console.log("Delete", historique);
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
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Selling Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Quantity</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Supplier</span>
            </TableCell>
            <TableCell align="right">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historiqueData.map((historique) => (
            <ProductHistoriqueRow
              key={historique.date}
              historique={historique}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
