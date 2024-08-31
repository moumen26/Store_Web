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

// Set the app element for accessibility
Modal.setAppElement("#root"); // or the ID of your root element


export default function ProductsContainerAddOrder({ searchQuery, onSelectProduct }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    onSelectProduct(product);
  };

  //---------------------------------API calls---------------------------------\\
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  // fetching Stock data
  const fetchStockData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Stock/store/${decodedToken.id}`,
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
      else throw new Error("Error receiving Stock data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: StockData,
    error: StockError,
    isLoading: StockLoading,
    refetch: StockRefetch,
  } = useQuery({
    queryKey: ["StockData", user?.token],
    queryFn: fetchStockData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  return (
    <div className="productsContainer">
      {StockLoading || StockError ? 
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
        :
        StockData?.length > 0 ? (
          StockData?.map((stock) => (
            <ProductCard
              key={stock._id}
              productName={stock.product?.brand?.name + ' ' + stock.product?.name + ' ' + stock.product?.size}
              productImage={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${stock.product?.image}`}
              onClick={() => handleSelectProduct(stock)}
              selected={selectedProduct && stock?._id === selectedProduct._id}
            />
          ))
        ) : (
          <p>No products available</p>
        )
      }
    </div>
  );
}
