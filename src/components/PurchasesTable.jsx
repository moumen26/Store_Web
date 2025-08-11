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
            {formatNumber(row.totalAmount)}
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
                  {row.sousPurchases?.map((purchaseDetailsRow, index) => (
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
                          {`${purchaseDetailsRow?.sousStock?.stock.product.name} ${purchaseDetailsRow?.sousStock?.stock.product.size}`}
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
                          {formatNumber(purchaseDetailsRow.price)}
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

export default function PurchasesTable({
  searchQuery,
  setFilteredData,
  setPurchasesData,
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

  // fetching Purchases data
  const fetchPurchasesData = async () => {
    const queryParams = buildQueryParams();
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/all/new/${decodedToken.id}?${queryParams}`,
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
      if (errorData.error.statusCode == 404) {
        return {
          data: [],
          pagination: {
            total_pages: 0,
            total_items: 0,
            current_page: 1,
            items_per_page: paginationInfo.items_per_page || 10,
            has_next_page: false,
            has_prev_page: false,
          },
          filters: {
            search: searchQuery || "",
            startDate: dateRange.startDate || "",
            endDate: dateRange.endDate || "",
          },
        };
      } else throw new Error("Error receiving Purchases data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: PurchasesResponse,
    error: PurchasesError,
    isLoading: PurchasesLoading,
    refetch: PurchasesRefetch,
  } = useQuery({
    queryKey: [
      "PurchasesData",
      user?.token,
      currentPage,
      searchQuery,
      dateRange.startDate,
      dateRange.endDate,
      paginationInfo.items_per_page,
      location.key
    ],
    queryFn: fetchPurchasesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // refetch on window focus (optional)
    staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
    keepPreviousData: true, // Keep previous data while loading new data
  });

  const [rows, setRows] = useState([]);

  // Transform PurchasesResponse into rows when it changes
  useEffect(() => {
    if (PurchasesResponse?.data?.length > 0) {
      setRows(PurchasesResponse.data);
      setPurchasesData(PurchasesResponse.data); // Update PurchasesData state

      // Pass pagination info to parent
      if (onPaginationChange) {
        onPaginationChange(PurchasesResponse.pagination);
      }
    } else {
      setRows([]);
      setPurchasesData([]); // Reset PurchasesData if no data is returned
      // Pass empty pagination info to parent
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
  }, [PurchasesResponse, setPurchasesData, onPaginationChange, paginationInfo.items_per_page]);

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
          {PurchasesLoading ? (
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
          ) : rows.length > 0 ? (
            [...rows]
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
