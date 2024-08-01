import React from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import AddOrderProfileDetails from "../components/AddOrderProfileDetails";

export default function AddOrder() {
  return (
    <div className="pagesContainer addOrder">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Add a new order</h2>
        <div className="flex items-center space-x-2">
          <ButtonCancel />
          <ButtonSave />
        </div>
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Order Details</h2>
        <AddOrderProfileDetails />
      </div>
    </div>
  );
}
