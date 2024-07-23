import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import CustomerTable from "../components/CustomerTable";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Customers</h2>
        <ButtonAdd buttonSpan="New Customer" />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Customer..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="pageTableContainer">
          <CustomerTable searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
