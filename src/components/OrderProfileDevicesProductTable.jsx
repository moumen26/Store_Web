import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function priceRow(qty, unit) {
  return qty * unit;
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function OrderProfileDevicesProductTable({
  orderDetails,
  orderDeliveryAmount,
}) {
  const rows = orderDetails.map((item) => ({
    desc: `${item.productName} (${item.productBrand})`,
    qty: item.productQuantity,
    unit: item.productPrice,
    price: priceRow(item.productQuantity, item.productPrice),
  }));

  const invoiceSubtotal = subtotal(rows);
  const invoiceTotal = invoiceSubtotal + orderDeliveryAmount;

  return (
    <TableContainer
      className="tablePages"
      component={Paper}
      style={{ boxShadow: "none" }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell align="center" colSpan={3}>
              <span className="thTableSpan">Details</span>
            </TableCell>
            <TableCell align="right">
              <span className="thTableSpan">Price</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Products</span>
            </TableCell>
            <TableCell align="right">
              <span className="dashboardLatestOrdersDetails">Qty.</span>
            </TableCell>
            <TableCell align="right">
              <span className="dashboardLatestOrdersDetails">Unit</span>
            </TableCell>
            <TableCell align="right">
              <span className="dashboardLatestOrdersDetails">Sum</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <span className="trTableSpan">{row.desc}</span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{row.qty}</span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{row.unit.toFixed(2)}</span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{row.price.toFixed(2)}</span>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>
              <span className="dashboardLatestOrdersDetails">Subtotal</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{invoiceSubtotal.toFixed(2)}</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">
                Delivery Amount
              </span>
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">
              <span className="trTableSpan">
                {orderDeliveryAmount.toFixed(2)}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <span className="dashboardLatestOrdersDetails">Total</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{invoiceTotal.toFixed(2)}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
