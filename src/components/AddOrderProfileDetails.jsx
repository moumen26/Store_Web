import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Calendar } from "primereact/calendar";

export default function AddOrderProfileDetails() {
  const getCurrentAlgeriaTime = () => {
    const now = new Date();
    const algeriaOffset = 0; // Algeria is UTC+1
    const localOffset = now.getTimezoneOffset() / 60;
    const algeriaTime = new Date(
      now.getTime() + (algeriaOffset - localOffset) * 3600 * 1000
    );
    return algeriaTime;
  };

  const [orderDate, setOrderDate] = useState(getCurrentAlgeriaTime());
  const [orderBoxes, setOrderBoxes] = useState(0);
  const [orderType, setOrderType] = useState("pickup");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [courier, setCourier] = useState("Yalidine");
  const [deliveryAmount, setDeliveryAmount] = useState(0);

  const handleOrderDateChange = (e) => {
    setOrderDate(e.value);
    if (deliveryDate && new Date(e.value) > new Date(deliveryDate)) {
      setDeliveryDate(null);
    }
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
    setDeliveryDate(e.value);
  };

  const handleCourierChange = (e) => {
    setCourier(e.target.value);
  };

  const handleDeliveryAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      setDeliveryAmount(value === "" ? "" : Math.max(0, Number(value)));
    }
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
              <span className="thTableSpan">Order_ID</span>
            </TableCell>
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
                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">Delivery Amount</span>
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
              <span className="trTableSpan">orderID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="trTableSpan">orderCustomer</span>
            </TableCell>
            <TableCell className="tableCell">
              <Calendar
                value={orderDate}
                onChange={handleOrderDateChange}
                showTime
                showSeconds
                className="inputTable"
              />
            </TableCell>
            <TableCell className="tableCell">
              <input
                type="number"
                value={orderBoxes}
                onChange={handleBoxesChange}
                min="0"
                className="inputTable inputBoxes"
              />
            </TableCell>
            <TableCell className="tableCell">
              <select
                value={orderType}
                onChange={handleOrderTypeChange}
                className="inputTable inputSelect"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </TableCell>
            {orderType === "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <Calendar
                    value={deliveryDate}
                    onChange={handleDeliveryDateChange}
                    showTime
                    showSeconds
                    minDate={orderDate}
                    className="inputTable"
                  />
                </TableCell>
                <TableCell align="right" className="tableCell">
                  <select
                    value={courier}
                    onChange={handleCourierChange}
                    className="inputTable inputSelect"
                  >
                    <option value="Yalidine">Yalidine</option>
                    <option value="Courier2">Courier 2</option>
                    <option value="Courier3">Courier 3</option>
                  </select>
                </TableCell>
                <TableCell align="right" className="tableCell">
                  <div className="inputWrapper">
                    <input
                      type="text"
                      value={deliveryAmount}
                      onChange={handleDeliveryAmountChange}
                      min="0"
                      className="inputTable"
                    />
                    <span className="inputSpan">DA</span>
                  </div>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
