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
    details: [
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
          <span className="trTableSpan">{row.customer}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderId}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderDate}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.amount}</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">{row.status}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
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
                    <TableCell className="tableCell">
                      <span className="thTableSpan thDetails">Brand</span>
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
                  {row.details.map((detailsRow) => (
                    <TableRow key={detailsRow.productName} className="tableRow">
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {detailsRow.productName}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.brand}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.amount}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.quantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(detailsRow.amount * detailsRow.quantity)}
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
    amount: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
      })
    ).isRequired,
    customer: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
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
      <div className="w-full flex items-center justify-between">
        <h3 className="dashboardTitleItem">Latest Orders</h3>
        <span className="seeSpan">See All Orders</span>
      </div>
      <TableContainer
        className="tableContainer"
        component={Paper}
        style={{ boxShadow: "none" }}
      >
        <Table aria-label="collapsible table" className="table">
          <TableHead>
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
