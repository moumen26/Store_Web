import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function ProductProfileRow({ data }) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.product?.code}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.product?.name}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.product?.brand.name}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.product?.boxItems}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.quantity}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">
          {(data?.quantity / data?.product?.boxItems).toFixed(0)}
        </span>
      </TableCell>
    </TableRow>
  );
}

export default function ProductProfileDetails({ data }) {
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
              <span className="thTableSpan">Code Produit</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Nom</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Marque</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Articles par boîte</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Unité de stock</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Boîte de stock</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ProductProfileRow data={data} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
