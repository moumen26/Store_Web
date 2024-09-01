import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function ProductProfileRow({
  data,
}) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
        <TableCell className="tableCell">
            <span className="trTableSpan">{data?.buyingMathode}</span>
        </TableCell>
        <TableCell className="tableCell">
            <span className="trTableSpan">{data?.quantityLimit}</span>
        </TableCell>
        <TableCell className="tableCell">
            <span className="trTableSpan">{data?.destocking}</span>
        </TableCell>       
    </TableRow>
  );
}

export default function ProductProfileDetailsV2({ data }) {
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
              <span className="thTableSpan">buying methode</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Limited quantity</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Destocking</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ProductProfileRow
            data={data}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
