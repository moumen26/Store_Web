import React from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import ButtonExport from "../components/ButtonExport";
import OrderProfileDetails from "../components/OrderProfileDetails";

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
    customerCommune: customer.customerCommune,
    orderDate: customer.orderDate,
    orderBoxes: customer.orderBoxes,
    orderType: customer.orderType,
    orderStatus: customer.orderStatus,
    orderDeliveryDate: customer.orderDeliveryDate,
    orderCourier: customer.orderCourier,
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
    </div>
  );
}
