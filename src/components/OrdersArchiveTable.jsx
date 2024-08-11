import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
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
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import CircularProgress from "@mui/material/CircularProgress";

function Row(props) {
  const { row } = props;
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
        <TableCell component="th" scope="row" className="tableCell">
          <span className="trTableSpan">
            {row.customerFirstName} {row.customerLastName}
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderCode}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.orderDate)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderAmount} DA</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">
            {orderStatusTextDisplayer(row.orderStatus)}
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
          colSpan={7}
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
                  {row.orderDetails.map((orderDetailsRow) => (
                    <TableRow
                      key={orderDetailsRow.productName}
                      className="tableRow"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.productName}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.productPrice}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {orderDetailsRow.productQuantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            orderDetailsRow.productPrice *
                              orderDetailsRow.productQuantity
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
    orderCode: PropTypes.string.isRequired,
    orderAmount: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        productPrice: PropTypes.string.isRequired,
        productQuantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    customerLastName: PropTypes.string.isRequired,
    customerFirstName: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
};

const orderStatusTextDisplayer = (status) => {
  switch (status.toString()) {
    case "0":
      return "Order Placed";
    case "1":
      return "Preparing your order";
    case "2":
      return "Order on the way to address";
    case "3":
      return "Delivered";
    default:
      return "Order Placed";
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}`;
};
export default function OrdersArchiveTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const [ORDERDATA, setORDERDATA] = useState([]);
  const [loading, setLoading] = useState(false);
  const decodedToken = TokenDecoder();
  useEffect(() => {
    const fetchORDERDATA = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_URL_BASE}/Receipt/delivred/${
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

        const data = await response.json();
        if (response.ok) {
          setORDERDATA(data);
        } else {
          setORDERDATA([]);
          setRows([]);
          console.error(
            "Error receiving delivered ORDER data:",
            data.message
          );
        }
      } catch (error) {
        console.error("Error fetching delivered ORDER data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchORDERDATA();
  }, [user?.token]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (ORDERDATA.length > 0) {
      const rowsData = ORDERDATA.map((order) => ({
        orderId: order._id,
        orderCode: order.code,
        customerFirstName: order.client.firstName,
        customerLastName: order.client.lastName,
        orderDate: order.date,
        orderAmount: order.total.toString(),
        orderStatus: order.status.toString(),
        orderDetails: order.products.map((item) => ({
          productName: item.product.name,
          productPrice: item.price.toString(),
          productQuantity: item.quantity.toString(),
        })),
      }));
      setRows(rowsData);
      setFilteredRows(rowsData);
    }
  }, [ORDERDATA]);
  const [filteredRows, setFilteredRows] = useState(rows);
  useEffect(() => {
    const results = rows.filter(
      (row) =>
        row.customerLastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.customerFirstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderDetails.some((detail) =>
          detail.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredRows(results);
    setFilteredData(results);
  }, [searchQuery, setFilteredData]);
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
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => <Row key={row.orderId} row={row} />)
          ) : loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {/* <span className="thTableSpan">Loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No orders found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
