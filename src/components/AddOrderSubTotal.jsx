import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function AddOrderSubTotal({ subtotal, deliveryAmount, total, language }) {
  return (
    <Paper
      className="paperAddAchat"
      style={{ marginTop: "16px", boxShadow: "none" }}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المجموع" : "Sous-total"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {subtotal} {language === "ar" ? "دج" : "DA"}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "مبلغ التوصيل" : "Montant de livraison"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {deliveryAmount} {language === "ar" ? "دج" : "DA"}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الإجمالي" : "Total"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {total} {language === "ar" ? "دج" : "DA"}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default AddOrderSubTotal;
