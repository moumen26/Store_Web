import React from "react";
import Header from "../components/Header";
import Search from "../components/Search";

export default function Dashboard() {
  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex-col space-y-[6px]">
          <h2 className="pagesTitle">Welcome back, Hichem</h2>
          <span className="pagesSousTitle">
            Here's you current sales overview
          </span>
        </div>
        <Search />
      </div>
    </div>
  );
}
