import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import {
  formatDate,
  formatNumber,
  orderStatusTextDisplayer,
} from "../util/useFullFunctions";

function Row(props) {
  const { row, language } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/OrderProfile/${row._id}`);
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
        {/* <TableCell
          component="th"
          scope="row"
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {row._id}
          </span>
        </TableCell> */}
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
            {formatNumber(row.total)}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span className="trTableSpan text-[#28a745]">
            {formatNumber(
              Number(row.payment.reduce((sum, pay) => sum + pay.amount, 0))
            )}{" "}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <span className="trTableSpan text-[#008080]">
            {formatNumber(row.profit)}
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
            {row.credit
              ? language === "ar"
                ? "دَيْن"
                : "Crédit"
              : row.deposit
              ? language === "ar"
                ? "عربون"
                : "Dépôt"
              : language === "ar"
              ? "عادي"
              : "Normal"}
          </span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {orderStatusTextDisplayer(row.status, row.type, language)}
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
          colSpan={9}
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
                  {language === "ar"
                    ? "تفاصيل الطلب"
                    : "Détails de la Commande"}
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
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "اسم المنتج" : "Nom du Produit"}
                      </span>
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      align={language === "ar" ? "right" : "left"}
                    >
                      <span
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "العلامة التجارية" : "Marque"}
                      </span>
                    </TableCell>
                    <TableCell align="right" className="tableCell">
                      <span
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "المبلغ" : "Montant"}{" "}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell align="right" className="tableCell">
                      <span
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "الكمية" : "Quantité"}
                      </span>
                    </TableCell>
                    <TableCell
                      align={language === "ar" ? "left" : "right"}
                      className="tableCell"
                    >
                      <span
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "السعر الإجمالي" : "Prix Total"}{" "}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((detailsRow) => (
                    <TableRow key={detailsRow.product._id} className="tableRow">
                      <TableCell
                        component="th"
                        scope="row"
                        align={language === "ar" ? "right" : "left"}
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
                          {detailsRow.product.name} {detailsRow.product.size}
                        </span>
                      </TableCell>
                      <TableCell
                        align={language === "ar" ? "right" : "left"}
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
                          {detailsRow.product.brand.name}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
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
                      <TableCell align="right" className="tableCell">
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
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default function CustomerProfileOrdersTable({
  searchQuery,
  setFilteredData,
  data = [],
  loading,
  language,
}) {
  const [filteredRows, setFilteredRows] = useState(data);

  useEffect(() => {
    const results = data?.filter(
      (row) =>
        row._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.total
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.profit
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(results);
    if (setFilteredData) setFilteredData(results);
  }, [searchQuery, setFilteredData, filteredRows]);

  return (
    <TableContainer
      component={Paper}
      className="tablePages"
      style={{ boxShadow: "none" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {/* <TableCell
              className="tableHeadCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "معرف العميل" : "ID du client"}
              </span>
            </TableCell> */}
            <TableCell
              className="tableHeadCell"
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
              className="tableHeadCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "المبلغ" : "Montant"}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>
              </span>
            </TableCell>
            <TableCell
              className="tableHeadCell"
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
                </span>{" "}
              </span>
            </TableCell>
            <TableCell
              className="tableHeadCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الربح" : "Profit"}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>{" "}
              </span>
            </TableCell>
            <TableCell
              className="tableHeadCell"
              align={language === "ar" ? "right" : "left"}
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
            <TableCell align="right" className="tableHeadCell">
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
            <TableCell align="right" className="tableHeadCell">
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
              <TableCell colSpan={9} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !filteredRows || filteredRows.lenght <= 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "لم يتم العثور على طلبات"
                    : "Aucune commande trouvée"}
                </span>{" "}
              </TableCell>
            </TableRow>
          ) : (
            [...filteredRows]
              .reverse()
              .map((row) => <Row key={row._id} row={row} language={language} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomerProfileOrdersTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func,
};
