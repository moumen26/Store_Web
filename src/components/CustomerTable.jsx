import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  customerName,
  customerId,
  customerPhone,
  customerWilaya,
  cus
) {
  return {
    customerId,
    customerName,
    customerPhone,
    customerWilaya,
    cus,
  };
}

function Row(props) {
  const { row } = props;

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerName}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerId}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerPhone}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerWilaya}</span>
      </TableCell>
      <TableCell align="right" className="tableCell">
        <span className="trTableSpan">{row.cus}</span>
      </TableCell>
      <TableCell align="right" className="tableCell">
        
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    customerWilaya: PropTypes.string.isRequired,
    customerPhone: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    cus: PropTypes.string.isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
  createData(
    "0920496",
    "Khaldi Abdelmoumen",
    "0550189087",
    "Blida",
    "Ouled Aich"
  ),
];

export default function CustomerTable() {
  return (
    <TableContainer
      className="tablePages"
      component={Paper}
      style={{ boxShadow: "none" }}
    >
      <Table aria-label="collapsible table">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">
              <span className="thTableSpan">Customer_ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Phone Number</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Wilaya</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Commune</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.customer} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
