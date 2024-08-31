import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import OrderProfileDetails from "../components/OrderProfileDetails";
import { PhoneIcon } from "@heroicons/react/24/outline";
import OrderProfileDevicesProductTable from "../components/OrderProfileDevicesProductTable";
import ButtonExportPDF from "../components/ButtonExportPdf";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import { useQuery } from "@tanstack/react-query";

export default function OrderProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();

  //fetch data
  const fetchOrderData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const { 
    data: OrderData, 
    error: OrderDataError, 
    isLoading: OrderDataLoading, 
    refetch: refetchOrderData 
  } = useQuery({
    queryKey: ['OrderData', user?.token, location.key, id],
    queryFn: fetchOrderData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  if (OrderDataLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <Header />
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
          {/* <h1>Loading...</h1> */}
        </div>
      </div>
    );
  }

  if (OrderDataError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="customerClass">
          <h2 className="customerClassTitle">no data is available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pagesContainer">
      <Header />
      <div id="exportable-content" className="space-y-[32px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span>Orders</span>
            <ChevronRightIcon className="iconAsideBar" />
            <span>#{OrderData?.code}</span>
          </div>
          <ButtonExportPDF
            filename="Order_Profile"
            customerName={`${OrderData?.client.firstName}_${OrderData?.client.lastName}`}
            orderId={OrderData?.code}
          />
        </div>
        <div className="customerClass">
          <h2 className="customerClassTitle">Order Details</h2>
          <OrderProfileDetails orderDetails={OrderData} />
        </div>
        <div className="flex space-x-6 h-full">
          <div className="customerClass w-[60%]">
            <h2 className="customerClassTitle">Devices in the Order</h2>
            <OrderProfileDevicesProductTable
              orderDetails={OrderData?.products}
              orderDeliveryAmount={0}
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
                  <p className="orderProfileSpan">
                    {OrderData?.client.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Default Address
                </span>
                <div className="flex-col space-y-1">
                  <p className="orderProfileSpan">
                    {OrderData?.deliveredLocation
                      ? OrderData?.deliveredLocation
                      : "Pickup"}
                  </p>
                  <p className="orderProfileSpan">
                    {OrderData?.client.commune} {OrderData?.client.wilaya}
                  </p>
                  <p className="orderProfileSpan">Algerie</p>
                </div>
              </div>
            </div>
            <OrderStatus orderDetails={OrderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
