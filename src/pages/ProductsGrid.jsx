import React, { useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ProductsContainer from "../components/ProductsContainer";

export default function ProductsGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Products Grid</h2>
        <ButtonAdd buttonSpan="Add New Product" />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Product..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="pageTableContainer">
          <ProductsContainer searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
