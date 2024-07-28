import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import ButtonExport from "../components/ButtonExport";
import OrderProfileDetails from "../components/OrderProfileDetails";
import { PhoneIcon } from "@heroicons/react/24/outline";

import yalidineImage from "../assets/images/Yalidine.png";
import OrderProfileDevicesProductTable from "../components/OrderProfileDevicesProductTable";

export default function OrderProfile() {
  const location = useLocation();
  const { customer } = location.state || {};

  if (!customer) {
    return <div>No order data available.</div>;
  }

  const orderDetails = {
    customerId: customer.customerId,
    customerFirstName: customer.customerFirstName,
    customerLastName: customer.customerLastName,
    customerPhone: customer.customerPhone,
    customerWilaya: customer.customerWilaya,
    customerAddress: customer.customerAddress,
    customerCommune: customer.customerCommune,
    orderDate: customer.orderDate,
    orderBoxes: customer.orderBoxes,
    orderType: customer.orderType,
    orderStatus: customer.orderStatus,
    orderDeliveryDate: customer.orderDeliveryDate,
    orderCourier: customer.orderCourier,
    orderDetails: customer.orderDetails,
    orderDeliveryAmount: customer.orderDeliveryAmount,
  };

  const [selectedOption, setSelectedOption] = useState("pickupOption");
  const [selectedCourier, setSelectedCourier] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Orders</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>#{customer.orderId}</span>
        </div>
        <ButtonExport />
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Order Details</h2>
        <OrderProfileDetails orderDetails={orderDetails} />
      </div>
      <div className="flex space-x-6 h-full">
        <div className="customerClass w-[60%]">
          <h2 className="customerClassTitle">Devices in the Order</h2>
          <OrderProfileDevicesProductTable
            orderDetails={orderDetails.orderDetails}
            orderDeliveryAmount={orderDetails.orderDeliveryAmount}
          />
        </div>
        <div className="w-[40%] flex-col space-y-[32px]">
          <div className="customerClass">
            <h2 className="customerClassTitle">Customer</h2>
            <div className="flex-col space-y-1">
              <span className="dashboardLatestOrdersDetails">
                Contact Information
              </span>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="iconAsideBar text-[#888888]" />
                <p className="orderProfileSpan">{customer.customerPhone}</p>
              </div>
            </div>
            <div className="flex-col space-y-1">
              <span className="dashboardLatestOrdersDetails">
                Default Address
              </span>
              <div className="flex-col space-y-1">
                <p className="orderProfileSpan">{customer.customerAddress}</p>
                <p className="orderProfileSpan">
                  {customer.customerCommune} {customer.customerWilaya}
                </p>
                <p className="orderProfileSpan">Algerie</p>
              </div>
            </div>
          </div>
          <div className="customerClass flex-col space-y-1">
            <div className="flex justify-between items-center">
              <h2 className="customerClassTitle">Order Type</h2>
              <div className="selectOptionClass">
                <select
                  className="selectOptionOrderType"
                  name="selectOptionOrderType"
                  id="selectOptionOrderType"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <option value="deliveryOption">Delivery</option>
                  <option value="pickupOption">Pick Up</option>
                </select>
              </div>
            </div>
            {selectedOption === "deliveryOption" && (
              <div className="flex justify-between items-center">
                <h2 className="customerClassTitle">Courier</h2>
                <div className="selectOptionClass">
                  <select
                    className="selectOptionOrderType"
                    name="selectOptionCourier"
                    id="selectOptionCourier"
                    value={selectedCourier}
                    onChange={handleCourierChange}
                  >
                    <option value="yalidine">Yalidine</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          ;
        </div>
      </div>
    </div>
  );
}
