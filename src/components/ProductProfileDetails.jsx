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
  console.log(data);
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
        <span className="trTableSpan">{data?.buying} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.selling} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.quantity}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{data?.quantity / data?.product?.boxItems}</span>
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
              <span className="thTableSpan">Product Code</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Brand</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Box Items</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Selling Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Stock unity</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Stock box</span>
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
