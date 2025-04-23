import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatNumber } from "../util/useFullFunctions";

function AddAchatSubTotal({ total, discount = 0, language }) {
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
                {language === "ar" ? "تخفيض" : "Remise"}
              </span>
            </TableCell>
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(discount)} DA
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
                {language === "ar"
                  ? "الإجمالي بدون تخفيض"
                  : "Total sans remise"}
              </span>
            </TableCell>
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(total)} {language === "ar" ? "دج " : " DA"}
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
            <TableCell align={language === "ar" ? "right" : "left"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {discount > 0
                  ? formatNumber(Number(total) - Number(discount))
                  : formatNumber(Number(total))}{" "}
                {language === "ar" ? "دج " : " DA"}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default AddAchatSubTotal;
