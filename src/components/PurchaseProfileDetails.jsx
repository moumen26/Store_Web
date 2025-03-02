import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatDate } from "../util/useFullFunctions";

export default function PurchaseProfileDetails({ data }) {
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="order profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">
              <span className="thTableSpan">Fournisseur Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase Date</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Remaining Amount</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="tableRow"
          >
            <TableCell className="tableCell">
              <span className="trTableSpan">
                {data.fournisseur.firstName} {data.fournisseur.lastName}
              </span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">{formatDate(data.date)}</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {data.credit == true ? (
                  <span className="trTableSpan">Credit</span>
                ) : data.deposit == true ? (
                  <span className="trTableSpan">Deposit</span>
                ) : data.closed == true ? (
                  <span className="trTableSpan">Closed</span>
                ) : (
                  <span className="trTableSpan">Open</span>
                )}
              </span>
            </TableCell>

            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {data.totalAmount.toFixed(2) -
                  data.payment
                    .reduce((sum, pay) => sum + pay.amount, 0)
                    .toFixed(2)}{" "}
                DA
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
