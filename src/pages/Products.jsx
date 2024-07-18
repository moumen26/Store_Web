import React from "react";
import Asidebar from "../components/AsideBar";
import Header from "../components/Header";

export default function Products() {
  return (
    <div className="page flex">
      <Asidebar />
      <div className="pagesContainer">
        <Header />
      </div>
    </div>
  );
}
