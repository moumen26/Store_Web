import React from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";


export default function Customers() {
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Customers</h2>
        <ButtonAdd buttonSpan="New Customer" />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search placeholder="Search by Costumer.." />
        </div>
        <div className="pageTableContainer"></div>
      </div>
    </div>
  );
}
