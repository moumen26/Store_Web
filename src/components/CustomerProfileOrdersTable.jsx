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

function createData(
  customer,
  orderId,
  orderDate,
  amount,
  items,
  boxes,
  status,
  details
) {
  return {
    customer,
    orderId,
    orderDate,
    amount,
    status,
    boxes,
    items,
    details,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleViewClick = () => {
    // navigate(`/customers/${row.customerId}`);

    navigate("/OrderProfile", { state: { customer: row } });
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
          <span className="trTableSpan">{row.orderId}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderDate}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.amount} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.items}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.boxes}</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">{row.status}</span>
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
        productName: PropTypes.string.isRequired,
      })
    ).isRequired,
    customer: PropTypes.string.isRequired,
    items: PropTypes.string.isRequired,
    boxes: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "4",
    "10",
    "Preparing your order",
    [
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
    ]
  ),
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "4",
    "10",
    "Preparing your order",
    [
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
    ]
  ),
  createData(
    "Khaldi Adel",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "4",
    "10",
    "Preparing your order",
    [
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
    ]
  ),
  createData(
    "Khaldi Abdelmoumen",
    "0920496",
    "May 26, 2024 | 10:30 AM",
    "4000.00",
    "4",
    "10",
    "Preparing your order",
    [
      {
        productName: "Elio - 5L",
        brand: "Cevital",
        amount: 920,
        quantity: 3,
      },
      {
        productName: "Elio - 5L",
        brand: "Cevital",
        amount: 1,
        quantity: 3,
      },
    ]
  ),
];

export default function CustomerProfileOrdersTable({
  searchQuery,
  setFilteredData,
}) {
  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    const results = rows.filter(
      (row) =>
        row.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.orderDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.details.some(
          (detail) =>
            detail.productName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            detail.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="thTableSpan">Order ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Items</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Total Boxes</span>
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
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <span className="thTableSpan">No orders found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
