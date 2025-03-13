import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useParams } from "react-router-dom";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { TokenDecoder } from "../util/DecodeToken";

export default function NonApprovedCustomer() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();


  // fetching CustomerData data
  const fetchCustomerData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/Client/${id}/${decodedToken.id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
        }
    );

    // Handle the error state
    if (!response.ok) {
        const errorData = await response.json();
        if(errorData.error.statusCode == 404)
            return [];
        else
            throw new Error("Error receiving Customer data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const { data: CustomerData, error: CustomerDataError, isLoading: CustomerDataLoading, refetch: CustomerDataRefetch } = useQuery({
      queryKey: ['CustomerData', user?.token, location.key, id],
      queryFn: fetchCustomerData,
      enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
      refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  if (CustomerDataLoading) {
    return (
      <div className="pagesContainer">
        <Header />
        <div>
          <CircularProgress color="inherit" />

          {/* <h1>Loading...</h1> */}
        </div>
      </div>
    );
  }
  if (CustomerDataError) {
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
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Customers</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>
            #{CustomerData?._id}
          </span>
        </div>
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Personal Information</h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span className="personalInformationSpan">First Name</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Last Name</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Number Phone</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.phoneNumber}
            </h3>
          </div>
          {CustomerData?.email &&
            <div className="flex-col">
              <span className="personalInformationSpan">Email Address</span>
              <h3 className="personalInformationDetails">
                {CustomerData?.email}
              </h3>
            </div>
          }
          <div className="flex-col">
            <span className="personalInformationSpan">Wilaya</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Commune</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.commune}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Numero de register commerce</span>
            <h3 className="personalInformationDetails">{CustomerData?.r_commerce}</h3>
          </div>
        </div>
      </div>
      {CustomerData?.storeAddresses &&
      CustomerData?.storeAddresses.length > 0 ? (
        <div className="customerClass">
          <h2 className="customerClassTitle">Primary Delivery Address</h2>
          <div className="customerPrimaryAddress">
            {CustomerData?.storeAddresses.map((address, index) => (
              <CustomerPrimaryDelivery
                key={index}
                name={address.name}
                primaryDeliveryAddress={address.address}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
