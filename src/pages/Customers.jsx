import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import CustomerTable from "../components/CustomerTable";
import ButtonExport from "../components/ButtonExport";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
            onChange={handleSearchChange}
          />
          <ButtonExport data={filteredData} /> {/* Pass filtered data */}
        </div>
        <div className="pageTableContainer">
          <CustomerTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
