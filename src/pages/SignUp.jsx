import { ChevronRightIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

import SignUpImage from "../assets/images/SignUpImage.png";
import ButtonFacebok from "../components/ButtonFacebok";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";

export default function SignUp() {
  const navigate = useNavigate();

  const [Phone, setPhone] = useState("");

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleClickOpenConfirmationDialog = () => {
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleViewClick = (id) => {
    navigate(`/UpYourAccount/${id}`);
  };
  //send otp API
  const handleSendOTP = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE + `/auth/signup/store/v2`,
        {
          phone: Phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseConfirmDialog();
        setPhone("");
        handleViewClick(response.data.store);
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
        console.error("Error sending otp: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error sending otp");
      }
    }
  };

  return (
    <div className="signUp">
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
        <div className="flex items-center space-x-5">
          <span href="/" className="headerText alreadyText">
            Already have an account?
          </span>
          <div className="flex items-center">
            <a href="/SignIn" className="headerText signInText">
              SignIn
            </a>
            <ChevronRightIcon color="#26667E" />
          </div>
        </div>
      </div>
      <div className="signUpContainer w-full flex items-center justify-center">
        <div className="signUpContainerRight h-full border-r-2 border-[#C9E4EE]">
          <div className="signUpContainerRightContainer">
            <h2 className="titleText">
              Scale your store into <br />
              Stock
            </h2>
            <span className="spanText">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              quibusdam cumque amet ipsum eligendi omnis, aut ipsam,
              perspiciatis et nam, nihil nulla maxime similique modi excepturi
              dignissimos magni! Tempore, molestiae.
            </span>
            <ButtonFacebok />
            <div className="orClass">
              <div className="lineOr"></div>
              <span className="orText">or</span>
              <div className="lineOr"></div>
            </div>
            <InputForm
              labelForm="Phone Number"
              inputType="number"
              inputPlaceholder="+213"
              inputName="phoneNumber"
              value={Phone}
              setChangevalue={handlePhoneChange}
            />
            <ButtonDark
              buttonSpan="Get Started - For Free"
              setOnClick={handleClickOpenConfirmationDialog}
            />
          </div>
        </div>
        <div className="signUpContainerLeft">
          <img className="w-[85%]" src={SignUpImage} />
        </div>
      </div>
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleSendOTP}
        dialogTitle="Confirm Account Creation"
        dialogContentText={`Are you sure you want to create new store account with this phone number: ${Phone}?`}
        isloading={submitionLoading}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
