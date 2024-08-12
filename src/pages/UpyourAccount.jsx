import React from "react";

import UpAccountImage from "../assets/images/UpAccount.png";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { useNavigate } from "react-router-dom";

export default function UpYourAccount() {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/VerifyCode`);
  };

  const wilayas = [
    { value: "", label: "-- Select Store Wilaya --" },
    { value: "wilaya1", label: "Wilaya 1" },
    { value: "wilaya2", label: "Wilaya 2" },
  ];

  const communes = [
    { value: "", label: "-- Select Store Commune --" },
    { value: "commune1", label: "Commune 1" },
    { value: "commune2", label: "Commune 2" },
  ];

  return (
    <div className="signUp">
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
      </div>
      <div className="signUpContainer w-full flex items-center justify-center">
        <div className="signUpContainerRight w-[60%] h-full border-r-2 border-[#C9E4EE]">
          <div className="signUpContainerRightContainer">
            <h2 className="titleText">
              Let’s set up your <br />
              Account.
            </h2>
            <div className="logInForm mt-0">
              <form>
                <div className="flex space-x-8">
                  <InputForm
                    labelForm="First Name"
                    inputType="text"
                    inputPlaceholder="Your first name"
                    inputName="firstName"
                  />
                  <InputForm
                    labelForm="Last Name"
                    inputType="text"
                    inputPlaceholder="Your last name"
                    inputName="lastName"
                  />
                </div>
                <div className="flex space-x-8">
                  <InputForm
                    labelForm="Store Name"
                    inputType="text"
                    inputPlaceholder="Your Store Name"
                    inputName="storeName"
                  />
                  <InputForm
                    labelForm="Store Category"
                    inputType="text"
                    inputPlaceholder="Your Store Category"
                    inputName="storeCategory"
                  />
                </div>
                <div className="flex space-x-8">
                  <InputForm
                    labelForm="Address "
                    inputType="text"
                    inputPlaceholder="Your address"
                    inputName="storeAddress"
                  />
                  <div className="flex-col space-y-[12px] items-center">
                    <span>Wilaya</span>
                    <div className="selectStoreWilayaCommune w-[400px]">
                      <select name="storeWilaya">
                        {wilayas.map((wilaya) => (
                          <option key={wilaya.value} value={wilaya.value}>
                            {wilaya.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-8">
                  <div className="flex-col space-y-[12px] items-center">
                    <span>Commune</span>
                    <div className="selectStoreWilayaCommune w-[400px]">
                      <select name="storeCommune">
                        {communes.map((commune) => (
                          <option key={commune.value} value={commune.value}>
                            {commune.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <ButtonDark buttonSpan="Continue" />
              </form>
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex justify-center items-center">
          <img className="h-[90%]" src={UpAccountImage} />
        </div>
      </div>
    </div>
  );
}
