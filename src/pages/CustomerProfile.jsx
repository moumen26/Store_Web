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

export default function CustomerProfile() {
  const { id } = useParams();
  const location = useLocation();
  const { customer } = location.state || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate(`/AddOrder`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const { user } = useAuthContext();
  const [CustomerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
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

        if (response.ok) {
          const data = await response.json();
          setCustomerData(data);
        } else {
          setCustomerData(null);
          console.error("Error receiving Customer data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Customer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [user?.token]);
  if (loading) {
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
  if (!CustomerData) {
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
        <ButtonAdd
          buttonSpan="Create Order"
          showIcon={false}
          onClick={handleCreateOrder}
        />
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
      {customer?.customerTotalOrders && (
        <>
          <div className="customerClass">
            <h2 className="customerClassTitle">Stats</h2>
            <div className="flex space-x-4">
              <CustomerStatsCard
                customerStatsCardTitle="Total Orders"
                customerStatsCardDetails={customer?.customerTotalOrders}
              />
              <CustomerStatsCard
                customerStatsCardTitle="Total Amount"
                customerStatsCardDetails={customer?.customerTotalAmount}
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
            />
          </div>
        </>
      )}
    </div>
  );
}
