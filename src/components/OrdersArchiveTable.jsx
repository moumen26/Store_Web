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
        {/* <TableCell
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
                        {language === "ar" ? "السعر الإجمالي" : "Prix Total"}
                        <span className="text-[10px] align-baseline">
                          {language === "ar" ? "(دج)" : "(DA)"}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderDetails.map((orderDetailsRow, index) => (
                    <TableRow
                      key={`${orderDetailsRow.productName}-${index}`}
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

export default function OrdersArchiveTable({
  searchQuery,
  setFilteredData,
  setLatestOrderData,
  dateRange,
  language,
  currentPage,
  onPaginationChange,
  paginationInfo
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  // Build query parameters for server-side filtering
  const buildQueryParams = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: paginationInfo.items_per_page.toString()
    });

    if (searchQuery && searchQuery.trim() !== "") {
      params.append("search", searchQuery.trim());
    }

    if (dateRange.startDate) {
      params.append("startDate", dateRange.startDate);
    }

    if (dateRange.endDate) {
      params.append("endDate", dateRange.endDate);
    }

    return params.toString();
  };

  //fetch data
  const DelivredfetchOrderData = async () => {
    const queryParams = buildQueryParams();
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/delivred/all/${
        decodedToken.id
      }?${queryParams}`,
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
        return {
          data: [],
          pagination: {
            total_pages: 0,
            total_items: 0,
            current_page: 1,
            items_per_page: paginationInfo.items_per_page,
            has_next_page: false,
            has_prev_page: false,
          },
          filters: {
            search: searchQuery || "",
            startDate: dateRange.startDate || "",
            endDate: dateRange.endDate || "",
          },
        }; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrderResponse,
    error: DelivredOrderDataError,
    isLoading: DelivredOrderDataLoading,
    refetch: DelivredrefetchOrderData,
  } = useQuery({
    queryKey: [
      "DelivredOrderData",
      user?.token,
      currentPage,
      searchQuery,
      dateRange.startDate,
      dateRange.endDate,
      paginationInfo.items_per_page,
      location.key
    ],
    queryFn: DelivredfetchOrderData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
    keepPreviousData: true, // Keep previous data while loading new data
  });

  const [rows, setRows] = useState([]);
  // Transform OrderResponse data into rows when it changes
  useEffect(() => {
    if (OrderResponse?.data?.length > 0) {
      const rowsData = OrderResponse.data.map((order) => ({
        orderId: order._id,
        customerFirstName: order.client.firstName,
        customerLastName: order.client.lastName,
        orderDate: order.createdAt || order.date, // Use createdAt for date filtering
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
      setLatestOrderData(rowsData); // Set latest order data for summary calculations
      setFilteredData(rowsData); // All data is already filtered on server-side

      // Pass pagination info to parent
      if (onPaginationChange) {
        onPaginationChange(OrderResponse.pagination);
      }
    } else {
      setRows([]);
      setFilteredData([]);
      setLatestOrderData([]); // Reset latest order data if no orders found

      if (onPaginationChange) {
        onPaginationChange({
          total_pages: 0,
          total_items: 0,
          current_page: 1,
          items_per_page: paginationInfo.items_per_page,
          has_next_page: false,
          has_prev_page: false,
        });
      }
    }
  }, [OrderResponse, setLatestOrderData, setFilteredData, onPaginationChange, paginationInfo.items_per_page]);

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
          {rows.length > 0 ? (
            [...rows]
              .reverse()
              .map((row) => (
                <Row key={row.orderId} row={row} language={language} />
              ))
          ) : DelivredOrderDataLoading ? (
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

OrdersArchiveTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  dateRange: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};
