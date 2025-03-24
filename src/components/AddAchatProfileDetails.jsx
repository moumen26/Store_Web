import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Calendar } from "primereact/calendar";

export default function AddAchatProfileDetails({
  fournisseurName,
  PhoneNumber,
  language,
}) {
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="order profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "اسم المورد" : "Nom du fournisseur"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="tableRow"
          >
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="trTableSpan">{fournisseurName}</span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="trTableSpan">{PhoneNumber}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
