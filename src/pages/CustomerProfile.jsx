import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useParams } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import CustomerStatsCard from "../components/CustomerStatsCard";
import CustomerProfileOrdersTable from "../components/CustomerProfileOrdersTable";
import Search from "../components/Search";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { TokenDecoder } from "../util/DecodeToken";
import ButtonLight from "../components/ButtonLight";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CustomerProfile() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const { id } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [dialogOpenMakeVendor, setDialogOpenMakeVendor] = useState(false);
  const [confirmDialogOpenMakeVendor, setConfirmDialogOpenMakeVendor] =
    useState(false);
  const [buttonVendorText, setButtonVendorText] = useState("Make Vendor");

  const handleButtonVendorClick = () => {
    if (buttonVendorText === "Make Vendor") {
      setDialogOpenMakeVendor(true);
    } else {
      setConfirmDialogOpenMakeVendor(true);
    }
  };

  const handleCloseDialogVendor = () => {
    setDialogOpenMakeVendor(false);
    setConfirmDialogOpenMakeVendor(false);
  };

  const handleConfirmAsVendor = () => {
    setButtonVendorText("Is already Vendor");
    setDialogOpenMakeVendor(false);
  };

  const handleConfirmAsCustomer = () => {
    setButtonVendorText("Make Vendor");
    setConfirmDialogOpenMakeVendor(false);
  };

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate(`/AddOrder/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //---------------------------------API calls---------------------------------\\

  // Define a function that fetches the customer data
  const fetchCustomerData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/User/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return {};
      else throw new Error("Error receiving Customer data");
    }

    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the customer data
  const {
    data: CustomerData,
    error: CustomerDataError,
    isLoading: CustomerDataLoading,
    refetch: refetchCustomerDataData,
  } = useQuery({
    queryKey: ["CustomerData", user?.token, location.key, id],
    queryFn: fetchCustomerData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // Define a function that fetches the Order data
  const fetchOrderData = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/clientForStore/${id}/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle the error state
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return {};
      else throw new Error("Error receiving Order data");
    }

    // Return the data
    return await response.json();
  };

  //Use the useQuery hook to fetch the Order data
  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: refetchOrderDataData,
  } = useQuery({
    queryKey: ["OrderData", id, user?.token, location.key, id],
    queryFn: () => fetchOrderData(id),
    enabled: !!id && !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus
  });

  // fetching statistics data
  const fetchOrderStatisticsData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Receipt/statistics/${decodedToken.id}/${id}`,
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
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving order by client data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: OrderStatisticsData,
    error: OrderStatisticsDataError,
    isLoading: OrderStatisticsDataLoading,
    refetch: OrderStatisticsDataRefetch,
  } = useQuery({
    queryKey: ["OrderStatisticsData", user?.token, location.key],
    queryFn: fetchOrderStatisticsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  if (CustomerDataLoading) {
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
            {CustomerData
              ? `${CustomerData?.firstName} ${CustomerData?.lastName}`
              : "Customer Details"}
          </span>
        </div>
        <div className="flex space-x-2">
          <ButtonLight
            buttonSpan={buttonVendorText}
            onClick={handleButtonVendorClick}
          />
          <ConfirmDialog
            open={dialogOpenMakeVendor}
            onClose={handleCloseDialogVendor}
            onConfirm={handleConfirmAsVendor}
            dialogTitle="Confirm Vendor"
            dialogContentText="Are you sure you want to make this a vendor?"
          />
          <ConfirmDialog
            open={confirmDialogOpenMakeVendor}
            onClose={handleCloseDialogVendor}
            onConfirm={handleConfirmAsCustomer}
            dialogTitle="Cancel Vendor Option"
            dialogContentText="Are you sure you want to cancel the vendor option and make it a customer?"
          />
          <ButtonAdd
            buttonSpan="Create Order"
            showIcon={false}
            onClick={handleCreateOrder}
          />
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
          <div className="flex-col">
            <span className="personalInformationSpan">Email Address</span>
            <h3 className="personalInformationDetails">
              {CustomerData?.email}
            </h3>
          </div>
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
            <span className="personalInformationSpan">ID</span>
            <h3 className="personalInformationDetails">{CustomerData?.code}</h3>
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
                primaryDeliveryAddress={address}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="customerClass">
        <h2 className="customerClassTitle">Stats</h2>
        <div className="flex space-x-4">
          <CustomerStatsCard
            customerStatsCardTitle="Total Orders"
            customerStatsCardDetails={OrderStatisticsData?.count}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle="Total Amount"
            customerStatsCardDetails={OrderStatisticsData?.total}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle="Total Profit"
            customerStatsCardDetails={OrderStatisticsData?.profit}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle="Total Pending Payment"
            customerStatsCardDetails={OrderStatisticsData?.credit}
            loading={OrderStatisticsDataLoading}
          />
          <CustomerStatsCard
            customerStatsCardTitle="Total unpaid Payment"
            customerStatsCardDetails={OrderStatisticsData?.anpaid}
            loading={OrderStatisticsDataLoading}
          />
        </div>
      </div>
      <div className="customerClass customerOrdersClass">
        <div className="flex justify-between items-center">
          <h2 className="customerClassTitle">Orders</h2>
          <Search
            placeholder="Search by Order..."
            onChange={handleSearchChange}
          />
        </div>
        <CustomerProfileOrdersTable
          searchQuery={searchQuery}
          setFilteredData={setFilteredData}
          data={OrderData}
          loading={OrderDataLoading}
        />
      </div>
    </div>
  );
}
