import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Calendar } from "primereact/calendar";

export default function AddAchatProfileDetails() {
  const getCurrentAlgeriaTime = () => {
    const now = new Date();
    const algeriaOffset = 0; // Algeria is UTC+1
    const localOffset = now.getTimezoneOffset() / 60;
    const algeriaTime = new Date(
      now.getTime() + (algeriaOffset - localOffset) * 3600 * 1000
    );
    return algeriaTime;
  };

  const [orderDate, setOrderDate] = useState(getCurrentAlgeriaTime());
  const [deliveryDate, setDeliveryDate] = useState(null);

  const handleOrderDateChange = (e) => {
    setOrderDate(e.value);
    if (deliveryDate && new Date(e.value) > new Date(deliveryDate)) {
      setDeliveryDate(null);
    }
  };

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
              <span className="thTableSpan">Achat_ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Fournisseur Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Achat Date</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="tableRow"
          >
            <TableCell className="tableCell">
              <span className="trTableSpan">achatId</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">fournisseurName</span>
            </TableCell>
            <TableCell className="tableCell">
              <Calendar
                value={orderDate}
                onChange={handleOrderDateChange}
                showTime
                showSeconds
                className="inputTable"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
