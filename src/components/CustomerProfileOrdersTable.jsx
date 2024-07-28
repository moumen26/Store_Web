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

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleViewClick = () => {
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
          <span className="trTableSpan">{row.orderAmount} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderItems}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderBoxes}</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">{row.orderStatus}</span>
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
                  {row.orderDetails.map((detailsRow) => (
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
                          {detailsRow.productBrand}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.productPrice}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.productQuantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            detailsRow.productPrice * detailsRow.productQuantity
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
        orderAmount: PropTypes.number.isRequired,
        orderBrand: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        orderQuantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    customer: PropTypes.string.isRequired,
    orderItems: PropTypes.string.isRequired,
    orderBoxes: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
};

const rows = [
  {
    customerLastName: "Abdelmoumen",
    customerFirstName: "Khaldi",
    orderId: "0920425",
    customerPhone: "0550189087",
    customerAddress: "123 Rue Yousfi Abdelkader",
    customerCommune: "Ouled Aich",
    customerWilaya: "Blida",
    orderDate: "May 26, 2024 | 23:30 AM",
    orderAmount: "4000.00",
    orderStatus: "Preparing your order",
    orderBoxes: "10",
    orderItems: "4",
    orderType: "Delivery",
    orderDeliveryDate: "May 27, 2024 | 12:30 AM",
    orderCourier: "Yalidine",
    orderDeliveryAmount: 0,
    orderDetails: [
      {
        productName: "Elio - 1L",
        productBrand: "Cevital",
        productPrice: 920,
        productQuantity: 3,
      },
    ],
  },
  {
    customerLastName: "Mohamed",
    customerFirstName: "Khaldi",
    customerPhone: "0550189087",
    customerAddress: "123 Rue Yousfi Abdelkader",
    customerCommune: "Ouled Aich",
    customerWilaya: "Blida",
    orderId: "0920200",
    orderDate: "May 26, 2024 | 23:30 AM",
    orderAmount: "4000.00",
    orderStatus: "Preparing your order",
    orderBoxes: "20",
    orderItems: "8",
    orderType: "Delivery",
    orderDeliveryDate: "May 27, 2024 | 12:30 AM",
    orderCourier: "Yalidine",
    orderDeliveryAmount: 0,
    orderDetails: [
      {
        productName: "Elio - 1L",
        productBrand: "Cevital",
        productPrice: 920,
        productQuantity: 3,
      },
      {
        productName: "Elio - 1L",
        productBrand: "Cevital",
        productPrice: 1,
        productQuantity: 3,
      },
    ],
  },
];

export default function CustomerProfileOrdersTable({
  searchQuery,
  setFilteredData,
}) {
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
        row.orderDate.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(results);
    if (setFilteredData) setFilteredData(results);
  }, [searchQuery, setFilteredData]);

  return (
    <TableContainer
      component={Paper}
      className="tableContainer"
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
              <span className="thTableSpan">Items</span>
            </TableCell>
            <TableCell className="tableHeadCell">
              <span className="thTableSpan">Boxes</span>
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
          {filteredRows.map((row) => (
            <Row key={row.orderId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomerProfileOrdersTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func,
};
