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
          <span className="trTableSpan">{row.orderId}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderDate}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderItems}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.orderAmount}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.pendingPayment}</span>
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
                        Total Price (DA)
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
        productPrice: PropTypes.number.isRequired,
        productBrand: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        productQuantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    customerLastName: PropTypes.string.isRequired,
    customerFirstName: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    orderBoxes: PropTypes.string.isRequired,
    orderItems: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    orderDeliveryDate: PropTypes.string.isRequired,
    orderCourier: PropTypes.string.isRequired,
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
    orderStatus: "Completed",
    orderBoxes: "10",
    orderItems: "4",
    orderType: "Delivery",
    orderDeliveryDate: "May 27, 2024 | 12:30 AM",
    orderCourier: "Yalidine",
    orderDeliveryAmount: 0,
    pendingPayment: 0,

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
    orderStatus: "Pending",
    orderBoxes: "20",
    orderItems: "8",
    orderType: "Delivery",
    orderDeliveryDate: "May 27, 2024 | 12:30 AM",
    orderCourier: "Yalidine",
    orderDeliveryAmount: 0,
    pendingPayment: "2000.00",
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

export default function FournisseurProfileAchatsTable({ data, loading }) {
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
              <span className="thTableSpan">Purchase ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Purchase Date</span>
            </TableCell>

            <TableCell className="tableCell">
              <span className="thTableSpan">Amount</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Pending Payment</span>
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
          ) : data?.lenght > 0 ? (
            data.map((row) => <Row key={row.orderId} row={row} />)
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No Purchases found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
