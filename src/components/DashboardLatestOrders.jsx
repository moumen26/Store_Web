import * as React from "react";
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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(customer, orderId, orderDate, amount, status) {
  return {
    customer,
    orderId,
    orderDate,
    amount,
    status,
    history: [
      {
        productName: "Elio - 1L",
        brand: "Cevital",
        amount: 920,
        quantity: 3,
      },
      {
        productName: "Elio - 1L",
        brand: "Cevital",
        amount: 1,
        quantity: 3,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.customer}
        </TableCell>
        <TableCell>{row.orderId}</TableCell>
        <TableCell>{row.orderDate}</TableCell>
        <TableCell>{row.amount}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <span className="dashboardLatestOrdersDetails">
                Order Details
              </span>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell align="right">Amount (DA)</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price (DA)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.productName}
                      </TableCell>
                      <TableCell>{historyRow.brand}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{historyRow.quantity}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * historyRow.quantity)}
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
    orderId: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    orderDate: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    customer: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "Preparing your order"
  ),
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "Preparing your order"
  ),
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "Preparing your order"
  ),
];

export default function DashboardLatestOrders() {
  return (
    <div className="dashboardLatestOrders">
      <div className="w-full flex items-center justify-between ">
        <h3 className="dashboardTitleItem">Latest Orders</h3>
        <span className="seeSpan">See All Orders</span>
      </div>
      <TableContainer className="tableContainer" component={Paper}>
        <Table aria-label="collapsible table" className="table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Customer</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.customer} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
