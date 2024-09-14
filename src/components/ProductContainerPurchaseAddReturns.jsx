import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";
import Modal from "react-modal";
import ProductProfileDetails from "./ProductProfileDetails";
import ProductHistorique from "./ProductHistorique";
import ButtonAdd from "./ButtonAdd";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

// Set the app element for accessibility
Modal.setAppElement("#root"); // or the ID of your root element

export default function ProductContainerPurchaseAddReturns({
  searchQuery,
  onSelectProduct,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    onSelectProduct(product);
  };

  //---------------------------------API calls---------------------------------\\
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  // fetching LastOrderStatus data
  const LastfetchOrderStatusData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/ReceiptStatus/${id}/${decodedToken.id}`,
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
      else throw new Error("Error receiving LastOrderStatus data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: LastOrderStatusData,
    error: LastOrderStatusError,
    isLoading: LastOrderStatusLoading,
    refetch: LastOrderStatusRefetch,
  } = useQuery({
    queryKey: ["LastOrderStatusData", user?.token],
    queryFn: LastfetchOrderStatusData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  return (
    <div className="productsContainer">
      {LastOrderStatusLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
      ) : LastOrderStatusData?.products.length > 0 ? (
        LastOrderStatusData?.products.map((order) => (
          <ProductCard
            key={order._id}
            productName={
              order.product?.brand?.name +
              " " +
              order.product?.name +
              " " +
              order.product?.size
            }
            productQuantity={order.quantity}
            productPrice={order.price}
            productImage={`${import.meta.env.VITE_APP_URL_BASE.replace(
              "/api",
              ""
            )}/files/${order.product?.image}`}
            onClick={() => handleSelectProduct(order)}
            selected={selectedProduct && order?._id === selectedProduct._id}
          />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
