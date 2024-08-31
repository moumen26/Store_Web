import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { PhoneIcon } from "@heroicons/react/24/outline";
import ButtonExportPDF from "../components/ButtonExportPdf";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import PaymentHistorique from "../components/PaymentHistorique";
import PurchaseProfileDetails from "../components/PurchaseProfileDetails";
import PurchaseProfileDevicesProductTable from "../components/PurchaseProfileDevicesProductTable";

export default function PurchaseProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div id="exportable-content" className="space-y-[32px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span>Purchases</span>
            <ChevronRightIcon className="iconAsideBar" />
            <span>Purchase Code</span>
          </div>
          <div className="orderProfileButtons">
            <ButtonExportPDF filename="Purchase_Profile" />
            <ButtonAdd
              showIcon={false}
              buttonSpan="View Payment History"
              onClick={handleOpenModal}
            />
          </div>
        </div>
        <div className="customerClass">
          <h2 className="customerClassTitle">Purchase Details</h2>
          <PurchaseProfileDetails />
        </div>
        <div className="flex space-x-6 h-full">
          <div className="customerClass w-[60%]">
            <h2 className="customerClassTitle">Devices in the Purchase</h2>
            <PurchaseProfileDevicesProductTable />
          </div>
          <div className="w-[40%] flex-col space-y-[32px]">
            <div className="customerClass">
              <h2 className="customerClassTitle">Fournisseur</h2>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Contact Information
                </span>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="iconAsideBar text-[#888888]" />
                  <p className="orderProfileSpan">phone number</p>
                </div>
              </div>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Default Address
                </span>
                <div className="flex-col space-y-1">
                  <p className="orderProfileSpan">Address</p>
                  <p className="orderProfileSpan">Commune - Wilaya</p>
                  <p className="orderProfileSpan">Algerie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Payment History"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "60%",
            margin: "auto",
            height: "52%",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass">
          <h2 className="customerClassTitle">Payment History</h2>
          <div className="scrollProductHistorique">
            <PaymentHistorique />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCloseModal}
            style={{ marginTop: "20px" }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 absolute bottom-5 right-8"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
