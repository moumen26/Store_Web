import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function AddAchatSubTotal({ total, discount = 0 }) {
  return (
    <Paper style={{ marginTop: "16px", boxShadow: "none", width: "40%" }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Remise</span>
            </TableCell>           
            <TableCell align="right">
                <span className="trTableSpan">{discount} %</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Total sans remise</span>
            </TableCell>           
            <TableCell align="right">
              <span className="trTableSpan">{total} DA</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="dashboardLatestOrdersDetails">Total</span>
            </TableCell>           
            <TableCell align="right">
              <span className="trTableSpan">{discount > 0 ? total - (total * discount / 100) : total} DA</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default AddAchatSubTotal;
