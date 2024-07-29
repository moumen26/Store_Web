import React, { useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import ProductTable from "../components/ProductTable";
export default function ProductsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Products Stock</h2>
        <ButtonAdd buttonSpan="Add New Stock" />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Product..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Products" />
        </div>
        <div className="pageTableContainer">
          <ProductTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
