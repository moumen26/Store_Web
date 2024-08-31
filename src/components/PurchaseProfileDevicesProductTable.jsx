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

export default function PurchaseProfileDevicesProductTable() {
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
          {/* {rows.map((row, index) => ( */}
          <TableRow
          //   key={index}
          >
            <TableCell>
              <span className="trTableSpan">name-size</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">qty</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan">box</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan"></span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan"></span>
            </TableCell>
          </TableRow>
          {/* ))} */}

          <TableRow>
            <TableCell colSpan={2}>
              <span className="dashboardLatestOrdersDetails">Total</span>
            </TableCell>
            <TableCell align="right">
              <span className="trTableSpan"></span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
