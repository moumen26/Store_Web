import React, { useEffect, useState } from "react";
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
import { formatDate, orderStatusTextDisplayer } from "../util/useFullFunctions";
import { useQuery } from "@tanstack/react-query";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/OrderProfile/${row._id}`);
  };
  console.log(row)
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
        <TableCell component="th" scope="row" className="tableCell">
          <span className="trTableSpan">
            {row.client.firstName} {row.client.lastName}
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.code}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.date)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.total.toFixed(2)} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">
            {row.payment.reduce((sum, pay) => sum + pay.amount, 0).toFixed(2) + ' DA'}
          </span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">
            {orderStatusTextDisplayer(row.status)}
          </span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex justify-end pr-3">
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
            <Box sx={{ margin: 1 }}>
              <span className="dashboardLatestOrdersDetails">
                Order Details
              </span>
              <Table size="small" aria-label="purchases" className="table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell">
                      <span className="thTableSpan thDetails">
                        Product Name
                      </span>
                    </TableCell>
                    <TableCell align="right" className="tableCell">
                      <span className="thTableSpan thDetails">Amount (DA)</span>
                    </TableCell>
                    <TableCell align="right" className="tableCell">
                      <span className="thTableSpan thDetails">Quantity</span>
                    </TableCell>
                    <TableCell align="right" className="tableCell">
                      <span className="thTableSpan thDetails">
                        Total price (DA)
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((orderDetailsRow) => (
                    <TableRow
                      key={orderDetailsRow.product._id}
                      className="tableRow"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.product.name + ' ' + orderDetailsRow.product.size}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.price.toFixed(2)} DA
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.quantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            orderDetailsRow.price.toFixed(2) *
                              orderDetailsRow.quantity
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

export default function CreditOrdersTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  //fetch data
  const fetchCreditedOrdersData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/delivredCredited/${decodedToken.id}`,
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const { 
    data: CreditedOrderData, 
    error: CreditedOrderDataError, 
    isLoading: CreditedOrderDataLoading, 
    refetch: refetchCreditedOrderData 
  } = useQuery({
    queryKey: ['CreditedOrderData', user?.token, location.key],
    queryFn: fetchCreditedOrdersData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
    staleTime: 0,
  });

  // const [rows, setRows] = useState([]);
  // const [filteredRows, setFilteredRows] = useState(rows);
  // useEffect(() => {
  //   const results = rows.filter(
  //     (row) =>
  //       row.customerLastName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       row.customerFirstName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       row.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.orderAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.orderDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.orderDetails.some((detail) =>
  //         detail.productName.toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //   );
  //   setFilteredRows(results);
  //   setFilteredData(results);
  // }, [searchQuery, setFilteredData]);
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
            <TableCell className="tableCell">
              <span className="thTableSpan">Customer</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Payment</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {CreditedOrderDataLoading ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : CreditedOrderDataError || !CreditedOrderData || CreditedOrderData.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <span className="thTableSpan">No orders found</span>
              </TableCell>
            </TableRow>
          ) :  (
            CreditedOrderData.map((row) => <Row key={row._id} row={row} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
