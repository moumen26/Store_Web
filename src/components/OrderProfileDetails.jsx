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
                  ? orderDetails.expextedDeliveryDate
                  : "not defined"}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="trTableSpan">{orderDetails.total}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
const orderStatusTextDisplayer = (status) => {
  switch (status) {
    case 0:
      return "Order Placed";
    case 1:
      return "Preparing your order";
    case 2:
      return "Order on the way to address";
    case 3:
      return "Delivered";
    default:
      return "Order Placed";
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}`;
};
