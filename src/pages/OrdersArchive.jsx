import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import OrdersArchiveTable from "../components/OrdersArchiveTable";
export default function OrdersArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Orders Archive</h2>
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Order..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Orders Archive" />
        </div>
        <div className="pageTableContainer">
          <OrdersArchiveTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
