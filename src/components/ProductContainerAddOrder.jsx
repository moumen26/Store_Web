import React, { useMemo, useState } from "react";
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

export default function ProductsContainerAddOrder({
  searchQuery,
  selectedCategory,
  onSelectProduct,
  language,
}) {
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
    refetchOnWindowFocus: true, // enable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  // Filtering logic
  const filteredProducts = useMemo(() => {
    if (!StockData) return [];

    return StockData.filter((stock) => {
      const matchesSearchQuery =
        stock.product?.brand?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        stock.product?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? stock.product?.category == selectedCategory
        : true;

      return matchesSearchQuery && matchesCategory;
    });
  }, [StockData, searchQuery, selectedCategory]);

  return (
    <div className="productsContainer">
      {StockLoading || StockError ? (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((stock) => (
          <ProductCard
            key={stock._id}
            language={language}
            productName={`${stock.product?.brand?.name} ${stock.product?.name} ${stock.product?.size}`}
            productImage={`${import.meta.env.VITE_APP_FILES_URL}/${stock.product?.image}`}
            onClick={() => handleSelectProduct(stock)}
            selected={selectedProduct && stock?._id === selectedProduct._id}
          />
        ))
      ) : (
        <p
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar"
            ? "لا توجد منتجات متاحة"
            : "Aucun produit disponible"}
        </p>
      )}
    </div>
  );
}
