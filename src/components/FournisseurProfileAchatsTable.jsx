import * as React from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { formatDate, formatNumber } from "../util/useFullFunctions";

function Row(props) {
  const { row, language } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/PurchaseProfile/${row._id}`);
  };
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {formatDate(row.date, language)}
          </span>
        </TableCell>

        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {formatNumber(row.totalAmount)}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan text-[#28a745]"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {formatNumber(
              row.payment.reduce((sum, pay) => sum + pay.amount, 0)
            )}{" "}
          </span>
        </TableCell>
        <TableCell
          align={language === "ar" ? "right" : "right"}
          className="tableCell"
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row.credit && row.deposit
              ? language === "ar"
                ? "كلاهما"
                : "Les deux"
              : row.credit
              ? language === "ar"
                ? "ائتمان"
                : "Crédit"
              : row.deposit
              ? language === "ar"
                ? "وديعة"
                : "Dépôt"
              : language === "ar"
              ? "نقد"
              : "Espèces"}
          </span>
        </TableCell>
        <TableCell
          align={language === "ar" ? "right" : "right"}
          className="tableCell"
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row.closed
              ? language === "ar"
                ? "تم دفع المبلغ الإجمالي"
                : "Le montant total a été payé."
              : language === "ar"
              ? "لم يتم دفع المبلغ الإجمالي بعد"
              : "Le montant total n'a pas encore été payé."}
          </span>
        </TableCell>
        <TableCell
          align={language === "ar" ? "right" : "right"}
          className="tableCell w-[100px]"
        >
          <div
            className={`flex items-center ${
              language === "ar" ? "justify-start" : "justify-end"
            }`}
          >
            <EyeIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleViewClick}
            />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={8}
          className="tableCell"
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} className="pt-2">
              <div className="w-[100%] flex">
                <span
                  className="dashboardLatestOrdersDetails"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "تفاصيل الشراء" : "Détails de l'achat"}
                </span>
              </div>
              <Table size="small" aria-label="purchases" className="table mt-2">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="tableCell"
                      align={language === "ar" ? "right" : "left"}
                    >
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="thTableSpan thDetails"
                      >
                        {language === "ar" ? "اسم المنتج" : "Nom du produit"}
                      </span>
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      align={language === "ar" ? "right" : "left"}
                    >
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="thTableSpan thDetails"
                      >
                        {language === "ar" ? "العلامة التجارية" : "Quantité"}
                      </span>{" "}
                    </TableCell>
                    <TableCell
                      align={language === "ar" ? "right" : "right"}
                      className="tableCell"
                    >
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="thTableSpan thDetails"
                      >
                        {language === "ar" ? "السعر" : "Prix"}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>{" "}
                    </TableCell>
                    <TableCell
                      align={language === "ar" ? "right" : "right"}
                      className="tableCell"
                    >
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="thTableSpan thDetails"
                      >
                        {language === "ar" ? "الكمية" : "Quantité"}
                      </span>
                    </TableCell>
                    <TableCell
                      align={language === "ar" ? "left" : "right"}
                      className="tableCell"
                    >
                      <span
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                        className="thTableSpan thDetails"
                      >
                        {language === "ar" ? "السعر الإجمالي" : "Prix total"}{" "}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.sousPurchases?.map((detailsRow) =>
                    !detailsRow.sousStock ? null : (
                      <TableRow key={detailsRow._id} className="tableRow">
                        <TableCell
                          component="th"
                          scope="row"
                          className="tableCell"
                          align={language === "ar" ? "right" : "left"}
                        >
                          <span
                            className="trTableSpan trDetails"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {detailsRow.sousStock.stock.product.name +
                              " " +
                              detailsRow.sousStock.stock.product.size}
                          </span>
                        </TableCell>
                        <TableCell
                          className="tableCell"
                          align={language === "ar" ? "right" : "left"}
                        >
                          <span
                            className="trTableSpan trDetails"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {detailsRow.sousStock.stock.product.brand.name}
                          </span>
                        </TableCell>
                        <TableCell
                          align={language === "ar" ? "right" : "right"}
                          className="tableCell"
                        >
                          <span
                            className="trTableSpan trDetails"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {formatNumber(detailsRow.price)}
                          </span>
                        </TableCell>
                        <TableCell
                          align={language === "ar" ? "right" : "right"}
                          className="tableCell"
                        >
                          <span
                            className="trTableSpan trDetails"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {detailsRow.quantity}
                          </span>
                        </TableCell>
                        <TableCell
                          align={language === "ar" ? "left" : "right"}
                          className="tableCell"
                        >
                          <span
                            className="trTableSpan trDetails"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {formatNumber(
                              Number(detailsRow.price) *
                                Number(detailsRow.quantity)
                            )}{" "}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function FournisseurProfileAchatsTable({
  data = [],
  loading,
  language,
}) {
  return (
    <TableContainer
      className="tableContainer"
      component={Paper}
      style={{ boxShadow: "none" }}
    >
      <Table aria-label="collapsible table" className="table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell" />
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
                {language === "ar" ? "تاريخ الشراء" : "Date d'achat"}
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
                {language === "ar" ? "إجمالي المبلغ" : "Montant total"}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>
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
                {language === "ar" ? "الدفع" : "Paiement"}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>
              </span>
            </TableCell>
            <TableCell
              align={language === "ar" ? "right" : "right"}
              className="tableCell"
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "النوع" : "Type"}
              </span>
            </TableCell>
            <TableCell
              align={language === "ar" ? "right" : "right"}
              className="tableCell"
            >
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
            <TableCell
              align={language === "ar" ? "right" : "right"}
              className="tableCell"
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الإجراء" : "Action"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !data || data.lenght <= 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "لم يتم العثور على مشتريات"
                    : "Aucun achat trouvé"}
                </span>
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row) => (
              <Row key={row._id} row={row} language={language} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
