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
  const { row } = props;
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
        <TableCell component="th" scope="row" className="tableCell">
          <span className="trTableSpan">{row._id}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.date)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatNumber(row.total)} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan text-[#28a745]">
            {formatNumber(Number(
              row.payment.reduce((sum, pay) => sum + pay.amount, 0)
            ))}{" "}
            DA
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan text-[#008080]">
            {formatNumber(row.profit)} DA
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">
            {row.credit ? "credit" : row.deposit ? "deposit" : "normal"}
          </span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">
            {orderStatusTextDisplayer(row.status, row.type)}
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
          colSpan={9}
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
                  {row.products.map((detailsRow) => (
                    <TableRow key={detailsRow.product._id} className="tableRow">
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {detailsRow.product.name}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.product.brand.name}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {formatNumber(detailsRow.price)} DA
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.quantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {formatNumber(Number(detailsRow.price) * Number(detailsRow.quantity))}{" "}
                          DA
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
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Order ID</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Order Date</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Payment</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Profit</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Type</span>
            </TableCell>
            <TableCell align="right" className="tableHeadCell">
              <span className="thTableSpan">Status</span>
            </TableCell>
            <TableCell align="right" className="tableHeadCell">
              <span className="thTableSpan">Actions</span>
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
                <span className="thTableSpan">No Purchases found</span>
              </TableCell>
            </TableRow>
          ) : (
            [...filteredRows]
              .reverse()
              .map((row) => <Row key={row._id} row={row} />)
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
