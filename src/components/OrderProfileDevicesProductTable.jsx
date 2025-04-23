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

export default function OrderProfileDevicesProductTable({
  orderDetails,
  orderDeliveryAmount,
  language,
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

    const boxText =
      language === "ar"
        ? `${
            totalBoxes > 0
              ? `${totalBoxes} ${totalBoxes === 1 ? "علبة" : "علب"}`
              : ""
          }`
        : `${
            totalBoxes > 0
              ? `${totalBoxes} ${totalBoxes === 1 ? "boîte" : "boîtes"}`
              : ""
          }`;

    const itemsText =
      language === "ar"
        ? `${
            remainingItems > 0
              ? ` ${remainingItems} ${remainingItems === 1 ? "قطعة" : "قطع"}`
              : ""
          }`
        : `${
            remainingItems > 0
              ? ` ${remainingItems} ${
                  remainingItems === 1 ? "pièce" : "pièces"
                }`
              : ""
          }`;

    return {
      name: item.product.name,
      size: item.product.size,
      qty: item.quantity,
      unit: item.price,
      price: priceRow(item.quantity, item.price),
      box: `${boxText}${
        totalBoxes > 0 && remainingItems > 0 ? "+" : ""
      }${itemsText}`,
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
            <TableCell align={language === "ar" ? "right" : "left"} colSpan={4}>
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "التفاصيل" : "Détails"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "السعر" : "Prix"}
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
                {language === "ar" ? "المنتجات" : "Produits"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الكمية" : "Qté"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "العلب" : "Boîtes"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الوحدة" : "Unité"}
              </span>
            </TableCell>
            <TableCell align="right">
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المجموع" : "Total"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align={language === "ar" ? "right" : "left"}>
                <span
                  className="trTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {row.name} - {row.size}
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
                  {row.qty}
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
                  {row.box}
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
                  {formatNumber(row.unit)} {language === "ar" ? "دج " : " DA"}
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
                  {formatNumber(row.price)} {language === "ar" ? "دج " : " DA"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={4} />
            <TableCell colSpan={3} align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المجموع الفرعي" : "Sous-total"}
              </span>
            </TableCell>
            <TableCell align={language === "ar" ? "right" : "right"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(invoiceSubtotal)}{" "}
                {language === "ar" ? "دج " : " DA"}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "مبلغ التوصيل" : "Frais de livraison"}
              </span>
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align={language === "ar" ? "right" : "right"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(orderDeliveryAmount)}{" "}
                {language === "ar" ? "دج " : " DA"}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align={language === "ar" ? "right" : "left"}>
              <span
                className="dashboardLatestOrdersDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المجموع الكلي" : "Total général"}
              </span>
            </TableCell>
            <TableCell align={language === "ar" ? "right" : "right"}>
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(invoiceTotal)} {language === "ar" ? "دج " : " DA"}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
