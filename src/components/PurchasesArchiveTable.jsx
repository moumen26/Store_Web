import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
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
import { useLocation, useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
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
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
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
            {row.fournisseur.firstName} {row.fournisseur.lastName}
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
            {formatNumber(row.totalAmount)} {language === "ar" ? "دج " : " DA"}
          </span>
        </TableCell>
        <TableCell
          align={language === "ar" ? "right" : "right"}
          className="tableCell"
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
          colSpan={7}
          className="tableCell"
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} className="pt-2">
              <div className="w-[100%] flex">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="dashboardLatestOrdersDetails"
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
                        className="thTableSpan thDetails"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "ar" ? "اسم المنتج" : "Nom du produit"}
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
                        {language === "ar" ? "المبلغ" : "Montant"}
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
                        {language === "ar" ? "السعر الإجمالي" : "Prix total"}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.sousPurchases?.map((purchaseDetailsRow) => (
                    <TableRow key={purchaseDetailsRow._id} className="tableRow">
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
                          {`${purchaseDetailsRow.sousStock.stock.product.name} ${purchaseDetailsRow.sousStock.stock.product.size}`}
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
                          {formatNumber(purchaseDetailsRow.price)}{" "}
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
                          {purchaseDetailsRow.quantity.toString()}
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
                            Math.round(
                              purchaseDetailsRow.price.toString() *
                                purchaseDetailsRow.quantity.toString()
                            )
                          )}{" "}
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
  language: PropTypes.string.isRequired,
};

export default function PurchaseArchiveTable({
  searchQuery,
  setFilteredData,
  dateRange,
  language,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  // fetching Archive Purchases data
  const fetchArchivePurchasesData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/all/closed/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Archive Purchases data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: ArchivePurchasesData = [],
    error: ArchivePurchasesError,
    isLoading: ArchivePurchasesLoading,
    refetch: ArchivePurchasesRefetch,
  } = useQuery({
    queryKey: ["ArchivePurchasesData", user?.token, location.key],
    queryFn: fetchArchivePurchasesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  // Transform ArchivePurchasesData into rows when it changes
  useEffect(() => {
    if (ArchivePurchasesData?.length > 0) {
      setRows(ArchivePurchasesData);
      setFilteredRows(ArchivePurchasesData); // Initialize filteredRows with ArchivePurchasesData
    } else {
      setRows([]);
    }
  }, [ArchivePurchasesData]);

  // Memoized filtered rows based on searchQuery
  const filteredResults = useMemo(() => {
    // If there's no search query and no date range, return all rows
    if (!searchQuery && (!dateRange.startDate || !dateRange.endDate))
      return rows;

    return rows.filter((row) => {
      // Check if the row matches the search query
      const matchesSearchQuery =
        row._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.fournisseur.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.fournisseur.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.totalAmount
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.sousPurchases.some((detail) =>
          detail.sousStock.stock.product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

      // Check if the row's order date falls within the specified date range
      const orderDate = new Date(row.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      const isWithinDateRange =
        (!dateRange.startDate || orderDate >= startDate) &&
        (!dateRange.endDate || orderDate <= endDate);

      // Return true if both conditions are met
      return matchesSearchQuery && isWithinDateRange;
    });
  }, [rows, searchQuery, dateRange.startDate, dateRange.endDate]);

  // Update filteredRows and filteredData when filteredResults change
  useEffect(() => {
    setFilteredRows(filteredResults);
    setFilteredData(filteredResults);
  }, [filteredResults, setFilteredData]);
  return (
    <TableContainer
      className="tablePages"
      component={Paper}
      style={{ boxShadow: "none" }}
    >
      <Table aria-label="collapsible table" className="table">
        <TableHead className="tableHead">
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
                {language === "ar" ? "المورد" : "Fournisseur"}
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
                {language === "ar" ? "المبلغ" : "Montant"}
                <span className="text-[10px] align-baseline">
                  {language === "ar" ? "(دج)" : "(DA)"}
                </span>
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
                {language === "ar" ? "الإجراء" : "Action"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ArchivePurchasesLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {/* <span className="thTableSpan"
                style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
                >Loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : filteredRows.length > 0 ? (
            [...filteredRows]
              .reverse()
              .map((row) => <Row key={row._id} row={row} language={language} />)
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
