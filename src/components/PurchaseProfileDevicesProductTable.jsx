import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatNumber } from "../util/useFullFunctions";

function priceRow(qty, unit) {
  return qty * unit;
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function PurchaseProfileDevicesProductTable({
  PurchaseData,
  discount,
}) {
  const rows = PurchaseData?.sousStocks?.map((item) => {
    let totalBoxes = item.quantity / item.sousStock.stock.product.boxItems;
    const decimalPart = totalBoxes % 1;
    let remainingItems = 0;

    if (decimalPart === 0.5) {
      totalBoxes = Math.floor(totalBoxes) + 0.5;
    } else {
      totalBoxes = Math.floor(totalBoxes);
      remainingItems = item.quantity % item.sousStock.stock.product.boxItems;
    }

    if (totalBoxes < 1) {
      totalBoxes = 0;
    }
    return {
      name: item.sousStock.stock.product.name,
      size: item.sousStock.stock.product.size,
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
          {rows?.map((row, index) => (
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
                <span className="trTableSpan">{formatNumber(row.unit)} DA</span>
              </TableCell>
              <TableCell align="right">
                <span className="trTableSpan">{formatNumber(row.price)} DA</span>
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={4}>
              <span className="dashboardLatestOrdersDetails">Remise</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">{discount} %</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
              <span className="dashboardLatestOrdersDetails">
                Total sans remise
              </span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">
                {formatNumber(invoiceSubtotal)} DA
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
              <span className="dashboardLatestOrdersDetails">Total final</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">
                {(invoiceSubtotal - (invoiceSubtotal * discount) / 100).toFixed(
                  2
                )}{" "}
                DA
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
