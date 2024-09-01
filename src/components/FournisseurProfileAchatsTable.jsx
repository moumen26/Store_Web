import * as React from "react";
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
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../util/useFullFunctions";
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
        <TableCell className="tableCell">
          <span className="trTableSpan">{formatDate(row.date)}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.stock.length}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.totalAmount} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">
            {row.payment && row.payment.length > 0
              ? row.payment.reduce((total, payment) => total + payment.amount, 0)
              : 0} DA
          </span>        
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">{row.credit ? 'true' : 'false'}</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <span className="trTableSpan">{row.closed ? 'The full amount has been paid.' : 'The full amount has not been paid yet.'}</span>
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
                        Total Price (DA)
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.stock?.map((detailsRow) => (
                    <TableRow key={detailsRow._id} className="tableRow">
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableCell"
                      >
                        <span className="trTableSpan trDetails">
                          {detailsRow.stock.product.name + ' ' + detailsRow.stock.product.size}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.stock.product.brand.name}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.buying}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {detailsRow.quantity}
                        </span>
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        <span className="trTableSpan trDetails">
                          {Math.round(
                            detailsRow.buying * detailsRow.quantity
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

export default function FournisseurProfileAchatsTable({ data = [], loading }) {
  return (
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
              <span className="thTableSpan">Purchase Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase items</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Total Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Payments Amount</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Credit</span>
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !data || data.lenght <= 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No Purchases found</span>
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row) => <Row key={row.orderId} row={row} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
