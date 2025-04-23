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
    navigate(`/OrderProfile/${row.orderId}`);
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
            {row.customerFirstName} {row.customerLastName}
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
            {row.orderId}
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
            {formatDate(row.orderDate, language)}
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
            {formatNumber(Number(row.orderAmount))}{" "}
            {language === "ar" ? "دج" : "DA"}
          </span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span
            className="trTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {orderStatusTextDisplayer(row.orderStatus, row.orderType, language)}
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
                        {language === "ar" ? "المبلغ (دج)" : "Montant (DA)"}
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
                        {language === "ar"
                          ? "السعر الإجمالي (دج)"
                          : "Prix Total (DA)"}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderDetails.map((orderDetailsRow) => (
                    <TableRow
                      key={orderDetailsRow.productName}
                      className="tableRow"
                    >
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
                          {orderDetailsRow.productName}{" "}
                          {orderDetailsRow.productSize}
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
                          {formatNumber(Number(orderDetailsRow.productPrice))}
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
                          {orderDetailsRow.productQuantity}
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
                            Number(orderDetailsRow.productPrice) *
                              Number(orderDetailsRow.productQuantity)
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
  row: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderAmount: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        productPrice: PropTypes.string.isRequired,
        productSize: PropTypes.string.isRequired,
        productQuantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    customerLastName: PropTypes.string.isRequired,
    customerFirstName: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
  }).isRequired,
  language: PropTypes.string.isRequired,
};

export default function OrdersReturnsTable({
  searchQuery,
  setFilteredData,
  dateRange,
  language,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  //fetch data
  const ReturnedfetchOrderData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/returned/all/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: ReturnedOrderData,
    error: ReturnedOrderDataError,
    isLoading: ReturnedOrderDataLoading,
    refetch: ReturnedrefetchOrderData,
  } = useQuery({
    queryKey: ["ReturnedOrderData", user?.token, location.key],
    queryFn: ReturnedfetchOrderData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  useEffect(() => {
    if (ReturnedOrderData?.length > 0) {
      const rowsData = ReturnedOrderData.map((order) => ({
        orderId: order._id,
        customerFirstName: order.client.firstName,
        customerLastName: order.client.lastName,
        orderDate: order.date,
        orderAmount: order.total.toString(),
        orderStatus: order.status.toString(),
        orderType: order.type.toString(),
        orderDetails: order.products.map((item) => ({
          productName: item.product.name,
          productPrice: item.price.toString(),
          productSize: item.product.size.toString(),
          productQuantity: item.quantity.toString(),
        })),
      }));
      setRows(rowsData);
      setFilteredRows(rowsData);
    } else {
      setRows([]);
    }
  }, [ReturnedOrderData]);

  // Memoized filtered rows based on searchQuery
  const filteredResults = useMemo(() => {
    // If there's no search query and no date range, return all rows
    if (!searchQuery && (!dateRange.startDate || !dateRange.endDate))
      return rows;

    return rows.filter((row) => {
      // Check if the row matches the search query
      const matchesSearchQuery =
        row.customerLastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.customerFirstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderDetails.some((detail) =>
          detail.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Check if the row's order date falls within the specified date range
      const orderDate = new Date(row.orderDate);
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
                {language === "ar" ? "العميل" : "Client"}
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
                {language === "ar" ? "معرف الطلب" : "ID de la Commande"}
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
                {language === "ar" ? "تاريخ الطلب" : "Date de Commande"}
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
                {language === "ar" ? "الإجراء" : "Action"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            [...filteredRows]
              .reverse()
              .map((row) => (
                <Row key={row.orderId} row={row} language={language} />
              ))
          ) : ReturnedOrderDataLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
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
                    ? "لم يتم العثور على طلبات"
                    : "Aucune commande trouvée"}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

OrdersReturnsTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  dateRange: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};
