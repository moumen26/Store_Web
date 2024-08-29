import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerStatsCard from "../components/CustomerStatsCard";
import Search from "../components/Search";
import FournisseurProfileAchatsTable from "../components/FournisseurProfileAchatsTable";

export default function FournisseurProfile() {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate(`/AddAchat`);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Fournisseur</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>#Fournisseur Name</span>
        </div>
        <ButtonAdd
          buttonSpan="Create Achat"
          showIcon={false}
          onClick={handleCreateOrder}
        />
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Personal Information</h2>
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
      <>
        <div className="customerClass">
          <h2 className="customerClassTitle">Stats</h2>
          <div className="flex space-x-4">
            <CustomerStatsCard
              customerStatsCardTitle="Total Purchases"
              customerStatsCardDetails="22"
            />
            <CustomerStatsCard
              customerStatsCardTitle="Total Amount"
              customerStatsCardDetails="22000"
            />
            <CustomerStatsCard
              customerStatsCardTitle="Total Pending Payment"
              customerStatsCardDetails="0"
            />
          </div>
        </div>
        <div className="customerClass customerOrdersClass">
          <div className="flex justify-between items-center">
            <h2 className="customerClassTitle">Achats</h2>
            <Search
              placeholder="Search by Achat..."
              onChange={handleSearchChange}
            />
          </div>
          <FournisseurProfileAchatsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </>
    </div>
  );
}
