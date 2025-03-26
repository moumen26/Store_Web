import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Calendar } from "primereact/calendar";

export default function AddOrderProfileDetails({
  CustomerData,
  deliveryAmount,
  setDeliveryAmount,
  setAPIOrderType,
  setAPIDeliveryDate,
  language,
  setAPIDeliveryAddress,
}) {
  const getCurrentAlgeriaTime = () => {
    const now = new Date();
    const algeriaOffset = -1; // Algeria is UTC+1
    const localOffset = now.getTimezoneOffset() / 60;
    const algeriaTime = new Date(
      now.getTime() + (algeriaOffset - localOffset) * 3600 * 1000
    );
    return algeriaTime;
  };

  const [orderType, setOrderType] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(getCurrentAlgeriaTime());
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
    setAPIOrderType(e.target.value);
  };

  const handleDeliveryDateChange = (e) => {
    setDeliveryDate(e.value);
    setAPIDeliveryDate(e.value);
  };

  const handleDeliveryAddressChange = (e) => {
    const value = e.target.value;
    setDeliveryAddress(value);
    setAPIDeliveryAddress(value);
  };

  const handleDeliveryAmountChange = (e) => {
    const value = e.target.value;
    setDeliveryAmount(value);
  };

  // const [orderDate, setOrderDate] = useState(getCurrentAlgeriaTime());
  // const [courier, setCourier] = useState("Yalidine");

  // const handleOrderDateChange = (e) => {
  //   setOrderDate(e.value);
  //   if (deliveryDate && new Date(e.value) > new Date(deliveryDate)) {
  //     setDeliveryDate(null);
  //   }
  // };

  // const handleCourierChange = (e) => {
  //   setCourier(e.target.value);
  // };

  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="order profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "اسم العميل" : "Nom du client"}
              </span>
            </TableCell>

            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "نوع الطلب" : "Type de commande"}
              </span>
            </TableCell>

            {orderType === "delivery" && (
              <>
                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">
                    {language === "ar" ? "تاريخ التوصيل" : "Date de livraison"}
                  </span>
                </TableCell>

                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">
                    {language === "ar" ? "العنوان" : "Adresse"}
                  </span>
                </TableCell>

                <TableCell align="right" className="tableCell">
                  <span className="thTableSpan">
                    {language === "ar"
                      ? "مبلغ التوصيل"
                      : "Montant de livraison"}
                  </span>
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
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="trTableSpan">
                {CustomerData?.firstName} {CustomerData?.lastName}
              </span>
            </TableCell>
            {/* <TableCell className="tableCell">
              <Calendar
                value={orderDate}
                onChange={handleOrderDateChange}
                showTime
                showSeconds
                className="inputTable"
              />
            </TableCell> */}

            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <select
                value={orderType}
                onChange={handleOrderTypeChange}
                className="inputTable inputSelect w-[200px]"
              >
                <option value="" disabled selected>
                  {language === "ar"
                    ? "اختر نوع الطلب"
                    : "Sélectionnez un type"}
                </option>
                <option value="pickup">
                  {language === "ar" ? "استلام من المتجر" : "Retrait"}
                </option>
                <option value="delivery">
                  {language === "ar" ? "توصيل" : "Livraison"}
                </option>
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
                    minDate={getCurrentAlgeriaTime()}
                    className="inputTable"
                  />
                </TableCell>
                {/* <TableCell align="right" className="tableCell">
                  <select
                    value={courier}
                    onChange={handleCourierChange}
                    className="inputTable inputSelect"
                  >
                    <option value="Yalidine">Yalidine</option>
                    <option value="Courier2">Courier 2</option>
                    <option value="Courier3">Courier 3</option>
                  </select>
                </TableCell> */}
                <TableCell align="right" className="tableCell">
                  <select
                    value={deliveryAddress}
                    onChange={handleDeliveryAddressChange}
                    className="inputTable inputSelect w-[200px]"
                  >
                    <option value={null} disabled selected>
                      {language === "ar"
                        ? "اختر عنوانًا"
                        : "Sélectionnez une adresse"}
                    </option>
                    {CustomerData?.storeAddresses?.length > 0 &&
                      CustomerData.storeAddresses.map((address) => (
                        <option key={address._id} value={address.address}>
                          {address.address}
                        </option>
                      ))}
                  </select>
                </TableCell>
                <TableCell align="right" className="tableCell">
                  <div
                    className={`inputWrapper ${
                      language === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <input
                      type="number"
                      value={deliveryAmount}
                      onChange={handleDeliveryAmountChange}
                      min="0"
                      className="inputTable"
                    />
                    <span className="inputSpan">
                      {language === "ar" ? "دج" : "DA"}
                    </span>
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
