import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import CustomerStatsCard from "../components/CustomerStatsCard";

export default function FournisseurProfile() {
  const location = useLocation();

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Fournisseur</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span></span>
        </div>
        <ButtonAdd buttonSpan="Create Order" showIcon={false} />
      </div>
      <div className="costumerClass">
        <h2 className="costumerClassTitle">Personal Information</h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span className="personalInformationSpan">First Name</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Last Name</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Number Phone</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Email Address</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Commune</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Wilaya</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Postcode</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Address</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">ID</span>
            <h3 className="personalInformationDetails"></h3>
          </div>
        </div>
      </div>
      <div className="costumerClass">
        <h2 className="costumerClassTitle">Primary Delivery Address</h2>
        <div className="customerPrimaryAddress">
          <CustomerPrimaryDelivery primaryDeliveryAddress={address} />
        </div>
      </div>

      <div className="costumerClass">
        <h2 className="costumerClassTitle">Stats</h2>
        <div className="flex space-x-4">
          <CustomerStatsCard
            customerStatsCardTitle="Total Orders"
            customerStatsCardDetails="0"
          />
          <CustomerStatsCard
            customerStatsCardTitle="Total Amount"
            customerStatsCardDetails="0"
          />
        </div>
      </div>
      <div className="costumerClass customerOrdersClass">
        <h2 className="costumerClassTitle">Achats</h2>
      </div>
    </div>
  );
}
