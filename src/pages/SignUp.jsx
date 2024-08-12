import { ChevronRightIcon } from "@heroicons/react/16/solid";
import React from "react";

import SignUpImage from "../assets/images/SignUpImage.png";
import ButtonFacebok from "../components/ButtonFacebok";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/VerifyCode`);
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
        <div className="signUpContainerRight w-[60%] h-full border-r-2 border-[#C9E4EE]">
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
              inputType="phone"
              inputPlaceholder="+213"
              inputName="phoneNumber"
            />
            <ButtonDark
              buttonSpan="Get Started - For Free"
              setOnClick={handleViewClick}
            />
            <span className="spanText spanBottom">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              quibusdam cumque amet ipsum eligendi omnis, aut ipsam,
              perspiciatis et nam, nihil nulla maxime similique modi excepturi
              dignissimos magni! Tempore, molestiae.
            </span>
          </div>
        </div>
        <div className="w-[40%] h-full flex justify-end items-center">
          <img className="w-[85%]" src={SignUpImage} />
        </div>
      </div>
    </div>
  );
}
