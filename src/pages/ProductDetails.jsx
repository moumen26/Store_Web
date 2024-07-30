import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProductDetails() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [ProductData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
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

        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          setProductData(null);
          console.error("Error receiving Product data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [user?.token]);
  if (loading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <div className="w-full h-full flex items-center justify-center">
          {/* <h1>Loading...</h1> */}
          <CircularProgress color="inherit" />.
        </div>
      </div>
    );
  }
  if (!ProductData) {
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
      <Header />
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
