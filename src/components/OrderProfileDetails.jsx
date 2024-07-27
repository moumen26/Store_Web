import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function OrderProfileDetails({ orderDetails }) {
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
              <span className="thTableSpan">Customer Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Total Boxes</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Type</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Delivery Date</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Courier</span>
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
                {orderDetails.customerFirstName} {orderDetails.customerLastName}
              </span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">{orderDetails.orderDate}</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">{orderDetails.orderBoxes}</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">{orderDetails.orderType}</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">{orderDetails.orderStatus}</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {orderDetails.orderDeliveryDate}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">{orderDetails.orderCourier}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
