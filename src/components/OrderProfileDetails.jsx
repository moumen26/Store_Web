import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatDate, orderStatusTextDisplayer } from "../util/useFullFunctions";

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
              <span className="thTableSpan">Order Type</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Delivery Date</span>
            </TableCell>
            {orderDetails.type == "delivery" && (
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan">Delivery address</span>
              </TableCell>
            )}
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
                {orderDetails.client.firstName} {orderDetails.client.lastName}
              </span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">
                {formatDate(orderDetails.date)}
              </span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">{orderDetails.type}</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {orderStatusTextDisplayer(orderDetails.status)}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {orderDetails.expextedDeliveryDate
                  ? formatDate(orderDetails.expextedDeliveryDate)
                  : "not defined"}
              </span>
            </TableCell>
            {orderDetails.type == "delivery" && (
              <TableCell align="right" className="tableCell">
                <span className="trTableSpan">
                  {orderDetails?.deliveredLocation?.address}
                </span>
              </TableCell>
            )}
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">
                {(orderDetails.total - orderDetails.payment.reduce((sum, pay) => sum + pay.amount, 0)).toFixed(2)} DA
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
