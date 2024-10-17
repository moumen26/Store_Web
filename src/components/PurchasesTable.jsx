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
                  {row.sousPurchases?.map((purchaseDetailsRow) => (
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
                        {`${purchaseDetailsRow.sousStock.stock.product.name} ${purchaseDetailsRow.sousStock.stock.product.size}`}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.price.toFixed(2)} DA
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
                            purchaseDetailsRow.price.toString() *
                              purchaseDetailsRow.quantity.toString()
                          ).toFixed(2)} DA
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

export default function PurchasesTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  // fetching Purchases data
  const fetchPurchasesData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Purchase/all/new/${decodedToken.id}`,
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
      else throw new Error("Error receiving Purchases data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: PurchasesData = [],
    error: PurchasesError,
    isLoading: PurchasesLoading,
    refetch: PurchasesRefetch,
  } = useQuery({
    queryKey: ["PurchasesData", user?.token, location.key],
    queryFn: fetchPurchasesData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });
  
  // const [rows, setRows] = useState([]);
  // const [filteredRows, setFilteredRows] = useState(rows);
  // useEffect(() => {
  //   const results = rows.filter(
  //     (row) =>
  //       row.fournisseurLastName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       row.fournisseurFirstName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       row.purchaseAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.purchaseDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.purchaseDetails.some((detail) =>
  //         detail.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         detail.productPrice.toLowerCase().includes(searchQuery.toLowerCase())
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
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PurchasesLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {/* <span className="thTableSpan">Loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : PurchasesData.length > 0 ? (
            PurchasesData.map((row) => <Row key={row._id} row={row} />)
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No purchases found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
