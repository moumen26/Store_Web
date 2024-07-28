import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import OrderProfileDetails from "../components/OrderProfileDetails";
import { PhoneIcon } from "@heroicons/react/24/outline";

import OrderProfileDevicesProductTable from "../components/OrderProfileDevicesProductTable";
import ButtonExportPDF from "../components/ButtonExportPdf";

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

  return (
    <div className="pagesContainer">
      <Header />
      <div id="exportable-content" className="space-y-[32px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span>Orders</span>
            <ChevronRightIcon className="iconAsideBar" />
            <span>#{customer.orderId}</span>
          </div>
          <ButtonExportPDF
            filename="Order_Profile"
            customerName={`${customer.customerFirstName}_${customer.customerLastName}`}
            orderId={customer.orderId}
          />
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
          </div>
        </div>
      </div>
    </div>
  );
}
