import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function ProductDetails({ onToggle, isCollapsed }) {
  const { user } = useAuthContext();
  const { id } = useParams();
  const location = useLocation();

  //fetch data
  const fetchProductData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Product/${id}`,
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
        throw new Error("Error receiving product data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: ProductData,
    error: ProductDataError,
    isLoading: ProductDataLoading,
    refetch: refetchProductData,
  } = useQuery({
    queryKey: ["ProductData", user?.token, location.key, id],
    queryFn: fetchProductData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });
  if (ProductDataLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <div className="w-full h-full flex items-center justify-center">
          {/* <h1>Loading...</h1> */}
          <CircularProgress color="inherit" />.
        </div>
      </div>
    );
  }
  if (ProductDataError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="w-full flex items-center justify-between">
          <h2 className="pagesTitle">Product not found</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="pagesContainer">
      <div className="flexHeader">
        <div onClick={onToggle} className="equalsIcon">
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header />
      </div>{" "}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="pagesTitle">Products Details</h2>
          <br />
          <h2 className="pagesTitle">product code: {ProductData?.code}</h2>
          <h2 className="pagesTitle">product name: {ProductData?.name}</h2>
          <h2 className="pagesTitle">
            product subName: {ProductData?.subName}
          </h2>
          <h2 className="pagesTitle">product size: {ProductData?.size}</h2>
          <h2 className="pagesTitle">product image: {ProductData?.image}</h2>
          <h2 className="pagesTitle">
            product boxItems: {ProductData?.boxItems}
          </h2>
          <h5 className="pagesTitle">brand name: {ProductData?.brand.name}</h5>
          <h5 className="pagesTitle">
            brand image: {ProductData?.brand.image}
          </h5>
        </div>
      </div>
    </div>
  );
}
