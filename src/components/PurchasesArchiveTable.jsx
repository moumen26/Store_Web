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
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../util/useFullFunctions";

function Row(props) {
  const { row } = props;
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
            {row.fournisseur.firstName} {row.fournisseur.lastName}
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.date)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.totalAmount.toFixed(2)} DA</span>
        </TableCell>
        <TableCell className="tableCell">
        <span className="trTableSpan">
            {row.payment && row.payment.length > 0
              ? row.payment.reduce((total, payment) => total + payment.amount, 0)
              : 0} DA
          </span>          </TableCell>
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
                  {row.stock.map((purchaseDetailsRow) => (
                    <TableRow
                      key={purchaseDetailsRow._id}
                      className="tableRow"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                        {`${purchaseDetailsRow.stock.product.name} ${purchaseDetailsRow.stock.product.size}`}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.buying.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.quantity.toString()}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            purchaseDetailsRow.buying.toString() *
                              purchaseDetailsRow.quantity.toString()
                          ).toFixed(2)}
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

export default function PurchaseArchiveTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  // fetching Archive Purchases data
  const fetchArchivePurchasesData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Purchase/all/closed/${decodedToken.id}`,
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
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Archive Purchases data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: ArchivePurchasesData = [],
    error: ArchivePurchasesError,
    isLoading: ArchivePurchasesLoading,
    refetch: ArchivePurchasesRefetch,
  } = useQuery({
    queryKey: ["ArchivePurchasesData", user?.token, location.key],
    queryFn: fetchArchivePurchasesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  //const [rows, setRows] = useState([]);
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
              <span className="thTableSpan">Fournisseur</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Payment</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {ArchivePurchasesLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {/* <span className="thTableSpan">Loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : ArchivePurchasesData.length > 0 ? (
            ArchivePurchasesData.map((row) => <Row key={row._id} row={row} />)
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No archive purchases found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
