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
  const rows = orderDetails.map((item) => {
    let totalBoxes = item.quantity / item.product.boxItems;
    const decimalPart = totalBoxes % 1;
    let remainingItems = 0;

    if (decimalPart === 0.5) {
      totalBoxes = Math.floor(totalBoxes) + 0.5;
    } else {
      totalBoxes = Math.floor(totalBoxes);
      remainingItems = item.quantity % item.product.boxItems;
    }

    if (totalBoxes < 1) {
      totalBoxes = 0;
    }

    return {
      name: item.product.name,
      size: item.product.size,
      qty: item.quantity,
      unit: item.price,
      price: priceRow(item.quantity, item.price),
      box: `${
        totalBoxes > 0
          ? `${totalBoxes} ${totalBoxes === 1 ? "box" : "boxes"}`
          : ""
      }${totalBoxes > 0 && remainingItems > 0 ? "+" : ""}${
        remainingItems > 0
          ? ` ${remainingItems} ${remainingItems === 1 ? "item" : "items"}`
          : ""
      }`,
    };
  });

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
            <TableCell align="center" colSpan={4}>
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
              <span className="dashboardLatestOrdersDetails">Boxe.</span>
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
                <span className="trTableSpan">
                  {row.name} - {row.size}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{row.qty}</span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{row.box}</span>
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
            <TableCell rowSpan={4} />
            <TableCell colSpan={3}>
              <span className="dashboardLatestOrdersDetails">Subtotal</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{invoiceSubtotal.toFixed(2)}</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
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
            <TableCell colSpan={3}>
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
