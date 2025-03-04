import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon } from "@heroicons/react/24/outline";

function ProductProfileRow({ data }) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        {/* {isEditing ? (
          <input
            type="text"
            value={}
            onChange={}
            className="editable-input"
          />
        ) : ( */}
        <span className="trTableSpan">{data?.selling} DA</span>
        {/* )} */}
      </TableCell>
      <TableCell className="tableCell">
        {/* {isEditing ? (
          <input
            type="text"
            value={}
            onChange={}
            className="editable-input"
          />
        ) : ( */}
        <span className="trTableSpan">{data?.buyingMathode}</span>
        {/* )} */}
      </TableCell>
      <TableCell className="tableCell">
        {/* {isEditing ? (
          <input
            type="text"
            value={}
            onChange={}
            className="editable-input"
          />
        ) : ( */}
        <span className="trTableSpan">{data?.quantityLimit}</span>
        {/* )} */}
      </TableCell>
      <TableCell className="tableCell">
        {/* {isEditing ? (
          <input
            type="text"
            value={}
            onChange={}
            className="editable-input"
          />
        ) : ( */}
        <span className="trTableSpan">{data?.destocking}</span>
        {/* )} */}
      </TableCell>
      <TableCell className="tableCell w-[100px]">
        <div className="flex items-center justify-end space-x-3">
          {/* {isEditing ? (
            <>
              <button
                className="text-green-500 cursor-pointer hover:text-green-700"
                // onClick={}
              >
                Save
              </button>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                // onClick={}
              >
                Cancel
              </button>
            </>
          ) : ( */}
          <>
            <PencilIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              // onClick={onEditClick}
            />
          </>
          {/* )} */}
        </div>
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
              <span className="thTableSpan">Prix de vente</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Méthode d'achat</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Quantité limite</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Déstockage</span>
            </TableCell>
            <TableCell align="right">
              <span className="thTableSpan">Action</span>
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
