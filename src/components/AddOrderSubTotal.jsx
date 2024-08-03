import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function AddOrderSubTotal({ subtotal, deliveryAmount, total }) {
  return (
    <Paper style={{ marginTop: "16px", boxShadow: "none", width: '40%'}}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Subtotal</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{subtotal} DA</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">
                Delivery Amount
              </span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{deliveryAmount} DA</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Total</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{total} DA</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default AddOrderSubTotal;
