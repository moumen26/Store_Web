import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function AddOrderProfileDetails() {
  const getCurrentAlgeriaTime = () => {
    const now = new Date();
    // const algeriaOffset = 1; // Algeria is UTC+1
    const algeriaOffset = 0; // Algeria is UTC+1
    const localOffset = now.getTimezoneOffset() / 60;
    const algeriaTime = new Date(
      now.getTime() + (algeriaOffset - localOffset) * 3600 * 1000
    );
    return algeriaTime.toISOString().slice(0, 16);
  };

  const [orderDate, setOrderDate] = useState(getCurrentAlgeriaTime());
  const [orderBoxes, setOrderBoxes] = useState(0);
  const [orderType, setOrderType] = useState("pickup");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [courier, setCourier] = useState("Yalidine");

  const handleOrderDateChange = (e) => {
    setOrderDate(e.target.value);
  };

  const handleBoxesChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      setOrderBoxes(value === "" ? "" : Math.max(0, Number(value)));
    }
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const handleDeliveryDateChange = (e) => {
    setDeliveryDate(e.target.value);
  };

  const handleCourierChange = (e) => {
    setCourier(e.target.value);
  };

  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="order profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">
              <span className="thTableSpan">Customer Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Date</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Total Boxes</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Order Type</span>
            </TableCell>
            {orderType === "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">Delivery Date</span>
                </TableCell>
                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">Courier</span>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="tableRow"
          >
            <TableCell className="tableCell">
              <span className="trTableSpan">orderCustomer</span>
            </TableCell>
            <TableCell className="tableCell">
              <input
                type="datetime-local"
                value={orderDate}
                onChange={handleOrderDateChange}
                className="inputTable"
              />
            </TableCell>
            <TableCell className="tableCell">
              <input
                type="number"
                value={orderBoxes}
                onChange={handleBoxesChange}
                min="0"
                className="inputTable"
              />
            </TableCell>
            <TableCell className="tableCell">
              <select
                value={orderType}
                onChange={handleOrderTypeChange}
                className="inputTable"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </TableCell>
            {orderType === "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <input
                    type="datetime-local"
                    value={deliveryDate}
                    onChange={handleDeliveryDateChange}
                    className="inputTable"
                  />
                </TableCell>
                <TableCell align="right" className="tableCell">
                  <select
                    value={courier}
                    onChange={handleCourierChange}
                    className="inputTable"
                  >
                    <option value="Yalidine">Yalidine</option>
                    <option value="Courier2">Courier 2</option>
                    <option value="Courier3">Courier 3</option>
                  </select>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
