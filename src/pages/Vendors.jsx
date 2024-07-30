import React, { useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ButtonExportExcel from "../components/ButtonExportExel";
import VendorsTable from "../components/VendorsTable";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Vendors</h2>
        <ButtonAdd buttonSpan="Add New Vendors" />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Vendor..."
            onChange={handleSearchChange}
          />
          <ButtonExportExcel data={filteredData} filename="Customers" />
        </div>
        <div className="pageTableContainer">
          <VendorsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
