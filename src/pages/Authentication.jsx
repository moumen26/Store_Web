import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import AuthenticationTable from "../components/AuthenticationTable";
import ButtonExportExel from "../components/ButtonExportExel";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Authentication({ onToggle, isCollapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pagesContainer">
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div
            onClick={onToggle}
            className="w-fit h-fit p-1 flex justify-center items-center border border-[#c9e4ee] rounded-[4px] cursor-pointer"
          >
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header />
        </div>{" "}
        <div className="titlePageButton h-[48px]">
          <h2 className="pagesTitle">User Authentication</h2>
          {/* <ButtonAdd buttonSpan="New Customer" /> */}
        </div>
      </div>

      <div className="pageTable">
        <div className="addProductModalHeader">
          <Search
            placeholder="Search by User..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel
            data={filteredData}
            filename="User Authentication"
          />
        </div>
        <div className="pageTableContainer">
          <AuthenticationTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
    </div>
  );
}
