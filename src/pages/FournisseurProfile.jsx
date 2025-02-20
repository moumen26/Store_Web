import React, { useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonAdd from "../components/ButtonAdd";
import CustomerStatsCard from "../components/CustomerStatsCard";
import Search from "../components/Search";
import FournisseurProfileAchatsTable from "../components/FournisseurProfileAchatsTable";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { CircularProgress } from "@mui/material";

export default function FournisseurProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate(`/AddAchat/${id}`);
  };

  //---------------------------------API calls---------------------------------\\

  // fetching OneFournisseur data
  const fetchOneFournisseurData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Fournisseur/one/${id}`,
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
      else throw new Error("Error receiving fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: OneFournisseurData,
    error: OneFournisseurError,
    isLoading: OneFournisseurLoading,
    refetch: OneFournisseurRefetch,
  } = useQuery({
    queryKey: ["OneFournisseurData", user?.token, location.key],
    queryFn: fetchOneFournisseurData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Achat Data By Fournisseur data
  const fetchAchatDataByFournisseur = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/all/${decodedToken.id}/${id}`,
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
      else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: AchatDataByFournisseur,
    error: AchatDataByFournisseurError,
    isLoading: AchatDataByFournisseurLoading,
    refetch: AchatDataByFournisseurRefetch,
  } = useQuery({
    queryKey: ["AchatDataByFournisseur", user?.token, location.key],
    queryFn: fetchAchatDataByFournisseur,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching statistics data
  const fetchAchatStatisticsData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Purchase/statistics/${decodedToken.id}/${id}`,
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
      else throw new Error("Error receiving achat by fournisseur data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: AchatStatisticsData,
    error: AchatStatisticsDataError,
    isLoading: AchatStatisticsDataLoading,
    refetch: AchatStatisticsDataRefetch,
  } = useQuery({
    queryKey: ["AchatStatisticsData", user?.token, location.key],
    queryFn: fetchAchatStatisticsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  if (OneFournisseurLoading) {
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
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>Fournisseur</span>
          <ChevronRightIcon className="iconAsideBar" />
          <span>#{OneFournisseurData?._id}</span>
        </div>
        <ButtonAdd
          buttonSpan="Create Achat"
          showIcon={false}
          onClick={handleCreateOrder}
        />
      </div>
      <div className="customerClass paddingClass">
        <h2 className="customerClassTitle">Personal Information</h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span className="personalInformationSpan">First Name</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Last Name</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Number Phone</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.phoneNumber}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Wilaya</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span className="personalInformationSpan">Commune</span>
            <h3 className="personalInformationDetails">
              {OneFournisseurData?.commune}
            </h3>
          </div>
          {OneFournisseurData?.address && (
            <div className="flex-col">
              <span className="personalInformationSpan">Address</span>
              <h3 className="personalInformationDetails">
                {OneFournisseurData?.address}
              </h3>
            </div>
          )}
        </div>
      </div>
      <>
        <div className="customerClass paddingClass">
          <h2 className="customerClassTitle">Stats</h2>
          <div className="flex space-x-4">
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Purchases"
              customerStatsCardDetails={AchatStatisticsData?.count}
            />
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Amount"
              customerStatsCardDetails={AchatStatisticsData?.totalAmount.toFixed(
                2
              )}
            />
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Paid"
              customerStatsCardDetails={AchatStatisticsData?.totalPayment.toFixed(
                2
              )}
            />
            <CustomerStatsCard
              loading={AchatStatisticsDataLoading}
              customerStatsCardTitle="Total Unpaid"
              customerStatsCardDetails={`- ${AchatStatisticsData?.totalCreditUnpaid.toFixed(
                2
              )}`}
            />
          </div>
        </div>
        <div className="customerClass paddingClass customerOrdersClass">
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
            data={AchatDataByFournisseur}
            loading={AchatDataByFournisseurLoading}
          />
        </div>
      </>
    </div>
  );
}
