import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import CustomerStatsCard from "../components/CustomerStatsCard";
import CustomerProfileOrdersTable from "../components/CustomerProfileOrdersTable";
import Search from "../components/Search";

export default function CustomerProfile() {
  const location = useLocation();
  const { customer } = location.state || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Customers</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>
            {customer
              ? `${customer?.customerFirstName} ${customer?.customerLastName}`
              : "Customer Details"}
          </span>
        </div>
        <ButtonAdd buttonSpan="Create Order" showIcon={false} />
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Personal Information</h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span className="personalInformationSpan">First Name</span>
            <h3 className="personalInformationDetails">
              {customer?.customerFirstName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Last Name</span>
            <h3 className="personalInformationDetails">
              {customer?.customerLastName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Number Phone</span>
            <h3 className="personalInformationDetails">
              {customer?.customerPhone}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Email Address</span>
            <h3 className="personalInformationDetails">
              {customer?.customerEmail}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Wilaya</span>
            <h3 className="personalInformationDetails">
              {customer?.customerWilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Commune</span>
            <h3 className="personalInformationDetails">
              {customer?.customerCommune}
            </h3>
          </div>

          <div className="flex-col">
            <span className="personalInformationSpan">Postcode</span>
            <h3 className="personalInformationDetails">
              {customer?.customerPostcode}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Address</span>
            <h3 className="personalInformationDetails">
              {customer?.customerAddress}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">ID</span>
            <h3 className="personalInformationDetails">
              {customer?.customerId}
            </h3>
          </div>
        </div>
      </div>
      {customer?.customerPrimaryDeliveryAddress &&
      customer?.customerPrimaryDeliveryAddress.length > 0 ? (
        <div className="customerClass">
          <h2 className="customerClassTitle">Primary Delivery Address</h2>
          <div className="customerPrimaryAddress">
            {customer?.customerPrimaryDeliveryAddress.map((address, index) => (
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
    </div>
  );
}
