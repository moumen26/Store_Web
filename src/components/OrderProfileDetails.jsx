import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  formatDate,
  formatNumber,
  orderStatusTextDisplayer,
} from "../util/useFullFunctions";
import { Button } from "@mui/material";

export default function OrderProfileDetails({
  orderDetails,
  language,
  handleOpenPopup,
}) {
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="order profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "اسم العميل" : "Nom du client"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "تاريخ الطلب" : "Date de commande"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "نوع الطلب" : "Type de commande"}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الحالة" : "Statut"}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "تاريخ التوصيل" : "Date de livraison"}
              </span>
            </TableCell>
            {orderDetails?.type == "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <span
                    className="thTableSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar"
                      ? "عنوان التوصيل"
                      : "Adresse de livraison"}
                  </span>
                </TableCell>
                {(orderDetails?.status == 0 ||
                  orderDetails?.status == 1 ||
                  orderDetails?.status == 2) && (
                  <TableCell align="right" className="tableCell">
                    <span
                      className="thTableSpan"
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar" ? "سعر التوصيل" : "Prix de livraison"}
                    </span>
                  </TableCell>
                )}
              </>
            )}
            <TableCell align="right" className="tableCell">
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المبلغ المتبقي" : "Montant restant"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="tableRow"
          >
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {orderDetails?.client.firstName} {orderDetails?.client.lastName}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatDate(orderDetails?.date, language)}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {orderDetails?.type === "delivery"
                  ? language === "ar"
                    ? "توصيل"
                    : "Livraison"
                  : language === "ar"
                  ? "استلام"
                  : "Retrait"}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {orderStatusTextDisplayer(
                  orderDetails?.status,
                  orderDetails?.type,
                  language
                )}
              </span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {orderDetails?.expextedDeliveryDate
                  ? formatDate(Date(orderDetails?.expextedDeliveryDate))
                  : language === "ar"
                  ? "غير محدد"
                  : "Non défini"}
              </span>
            </TableCell>
            {orderDetails?.type == "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <span
                    className="trTableSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {orderDetails?.deliveredLocation?.address}
                  </span>
                </TableCell>
                {(orderDetails?.status == 0 ||
                  orderDetails?.status == 1 ||
                  orderDetails?.status == 2) && (
                  <TableCell align="right" className="tableCell">
                    <button
                      onClick={handleOpenPopup}
                      className={`
    bg-blue-50 border border-blue-200 rounded-md
    md:px-3 md:py-2 px-2 py-1.5
    md:text-sm text-xs text-blue-700 font-medium
    hover:bg-blue-100 hover:border-blue-300 
    transition-all duration-200
    whitespace-nowrap
  `}
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "ar"
                        ? "مبلغ التوصيل"
                        : "Montant de la livraison"}
                    </button>
                  </TableCell>
                )}
              </>
            )}
            <TableCell align="right" className="tableCell">
              <span
                className="trTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {formatNumber(
                  orderDetails?.total -
                    orderDetails?.payment.reduce(
                      (sum, pay) => sum + pay.amount,
                      0
                    )
                )}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>{" "}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
