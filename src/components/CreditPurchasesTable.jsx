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
    navigate(`/PurchaseProfile/${row.purchaseId}`);
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
            {row.fournisseurFirstName} {row.fournisseurLastName}
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.purchaseCode}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.purchaseDate)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.purchaseAmount} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">1000 DA</span>
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
                  {row.purchaseDetails.map((purchaseDetailsRow) => (
                    <TableRow
                      key={purchaseDetailsRow.productName}
                      className="tableRow"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.productName}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.productPrice}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {purchaseDetailsRow.productQuantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            purchaseDetailsRow.productPrice *
                              purchaseDetailsRow.productQuantity
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
    purchaseId: PropTypes.string.isRequired,
    purchaseCode: PropTypes.string.isRequired,
    purchaseAmount: PropTypes.string.isRequired,
    purchaseDate: PropTypes.string.isRequired,
    purchaseDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        productPrice: PropTypes.string.isRequired,
        productQuantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    fournisseurLastName: PropTypes.string.isRequired,
    fournisseurFirstName: PropTypes.string.isRequired,
  }).isRequired,
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
export default function CreditPurchasesTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const [ORDERDATA, setORDERDATA] = useState([]);
  const [loading, setLoading] = useState(false);
  const decodedToken = TokenDecoder();
  useEffect(() => {
    const fetchORDERDATA = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_URL_BASE}/Receipt/noneDelivred/${
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
            "Error receiving none delivered ORDER data:",
            data.message
          );
        }
      } catch (error) {
        console.error("Error fetching none delivered ORDER data:", error);
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
        purchaseId: order._id,
        purchaseCode: order.code,
        fournisseurFirstName: order.client.firstName,
        fournisseurLastName: order.client.lastName,
        purchaseDate: order.date,
        purchaseAmount: order.total.toString(),
        purchaseDetails: order.products.map((item) => ({
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
        row.fournisseurLastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.fournisseurFirstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.purchaseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.purchaseAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.purchaseDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.purchaseDetails.some((detail) =>
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
              <span className="thTableSpan">Fournisseur</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Remaining Amount</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => <Row key={row.purchaseId} row={row} />)
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
                <span className="thTableSpan">No purchases found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
