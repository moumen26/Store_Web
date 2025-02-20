import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonExportExcel from "../components/ButtonExportExel";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import PublicitéTable from "../components/PublicitéTable";
import PubSwiperStore from "../components/PubSwiperStore";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { TokenDecoder } from "../util/DecodeToken";

// Ensure you set the root element for accessibility
Modal.setAppElement("#root");

export default function Publicité() {
  const decodedToken = TokenDecoder();
  const { user } = useAuthContext();
  const location = useLocation();
  const [openModelAddPub, setOpenModelAddPub] = useState(false);
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Distination, setDistination] = useState("");
  const handleDistinationChange = (e) => {
    setDistination(e.target.value);
  };
  const handleOpenModalAddPub = () => {
    setOpenModelAddPub(true);
  };

  const handleCloseModalAddPub = () => {
    setOpenModelAddPub(false);
  };

  const [uploadedImage, setUploadedImage] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
    }
  };

  const openFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  const clearForm = () => {
    setUploadedImage(null);
  };

  // fetching StorePublicity data
  const fetchStorePublicityData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE +
        `/Publicity/fetchAllStorePublicities/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving StorePublicity data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: StorePublicityData,
    error: StorePublicityError,
    isLoading: StorePublicityLoading,
    refetch: StorePublicityRefetch,
  } = useQuery({
    queryKey: ["StorePublicityData", user?.token, location.key],
    queryFn: fetchStorePublicityData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
  });

  //save Publicity API
  const handleSavePublicity = async () => {
    try {
      setSubmitionLoading(true);
      const formData = new FormData();
      formData.append("file", uploadedImage);
      formData.append("distination", Distination);

      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/Publicity/createFromStore/${decodedToken.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        StorePublicityRefetch();
        setSubmitionLoading(false);
        clearForm();
        handleCloseModalAddPub();
      } else {
        setAlertType(true);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType(true);
        setSnackbarMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error creating Publicity: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating Publicity", error);
      }
    }
  };

  if (StorePublicityLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <Header />
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
      </div>
    );
  }
  if (StorePublicityError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="customerClass">
          <h2 className="customerClassTitle">no data is available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pagesContainer pubContainer">
      <Header />
      <div className="titlePageButton">
        <h2 className="pagesTitle">Publicité</h2>
        <ButtonAdd
          buttonSpan="Add a Publicité"
          onClick={handleOpenModalAddPub}
        />
      </div>
      <PubSwiperStore
        data={StorePublicityData}
        loading={StorePublicityLoading}
        StorePublicityRefetch={StorePublicityRefetch}
        user={user}
      />
      <Modal
        isOpen={openModelAddPub}
        onRequestClose={handleCloseModalAddPub}
        contentLabel="Add new Publicité"
        className="addNewModal "
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass">
          <h2 className="customerClassTitle">Add New Publicité</h2>

          {/* Image Upload Section */}
          <div className="mt-[20px]">
            <div
              className="w-full h-[300px] flex justify-center items-center border-dashed border-[2px] border-gray-400 cursor-pointer"
              onClick={openFileInput}
            >
              {uploadedImage ? (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="uploadSpan">
                  <span className="text-blue-600">Click to upload </span>
                  or drag and drop SVG, PNG, JPG
                </p>
              )}
              <input
                id="imageUploadInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Distination Input select */}
          <div className="flex space-x-5 items-center mt-[8px]">
            <span>Distination :</span>
            <div className="selectStoreWilayaCommune w-[300px]">
              <select name="productCategory" onChange={handleDistinationChange}>
                <option value="">-- Select Distination --</option>
                <option value="private">private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-8 items-start mt-[20px]">
            <button
              className="text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleCloseModalAddPub}
            >
              Cancel
            </button>
            <button
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={handleSavePublicity}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertType ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
