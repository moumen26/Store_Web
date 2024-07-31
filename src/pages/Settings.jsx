import React, { useRef, useState } from "react";
import {
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/16/solid";
import InputForm from "../components/InputForm";
import { wilayasAndCommunes } from "../util/WilayaCommunesData";
import ButtonDelete from "../components/ButtonDelete";
import ButtonSave from "../components/ButtonSave";
export default function Settings() {
  const [activeTab, setActiveTab] = useState("PersoInf");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
    setSelectedCommune("");
  };

  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
  };

  const sortedWilayaCodes = Object.keys(wilayasAndCommunes).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <div className="pagesContainer settingsContainer">
      <div className="pageTable h-[100vh] flex-row">
        <div className="settingsLeft flex-col space-y-[32px]">
          <h2 className="pagesTitle">User profile management</h2>
          <div
            className={`flex-col space-y-7 ${
              activeTab === "PersoInf" || activeTab === "EmailPass"
                ? "AllTransparent"
                : ""
            }`}
          >
            <div
              className={`flex items-center settingItem cursor-pointer ${
                activeTab === "PersoInf" ? "settingItemToggle" : ""
              }`}
              onClick={() => handleTabClick("PersoInf")}
            >
              <UserIcon className="iconAsideBar" />
              <span className="ml-3">Personal Info</span>
            </div>
            <div
              className={`flex items-center settingItem cursor-pointer ${
                activeTab === "EmailPass" ? "settingItemToggle" : ""
              }`}
              onClick={() => handleTabClick("EmailPass")}
            >
              <ShieldCheckIcon className="iconAsideBar" />
              <span className="ml-3">Email & Password</span>
            </div>
          </div>
        </div>
        <div className="settingsRight">
          {activeTab === "PersoInf" && (
            <div className="flex-col settingsRightContainer">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Personal information</h2>
                <ButtonSave />
              </div>
              <div className="flex-col settingsRightScroll">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-[80px] h-[80px] bg-slate-200 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden"
                    onClick={handleClick}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="h-[80px] flex items-center justify-center uploadClass">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <p onClick={handleClick} className="uploadSpan">
                      <span className="text-blue-600">Click to upload</span> or
                      drag and drop SVG, PNG, JPG
                    </p>
                  </div>
                </div>
                <div>
                  <div className="settingPersonalInformation">
                    <InputForm
                      labelForm="First Name"
                      inputType="text"
                      inputName="firstName"
                    />
                    <InputForm
                      labelForm="Last Name"
                      inputType="text"
                      inputName="LastName"
                    />
                    <InputForm
                      labelForm="Email Address"
                      inputType="email"
                      inputName="emailAddress"
                    />
                    <InputForm
                      labelForm="Phone Number"
                      inputType="phone"
                      inputName="phoneNumber"
                    />
                    <div className="inputItem">
                      <span>Wilaya</span>
                      <select
                        className="selectOptionWilaya"
                        name="selectOptionWilaya"
                        id="selectOptionWilaya"
                        value={selectedWilaya}
                        onChange={handleWilayaChange}
                      >
                        <option value="" disabled>
                          -- Select Wilaya --
                        </option>
                        {sortedWilayaCodes.map((wilayaCode) => (
                          <option key={wilayaCode} value={wilayaCode}>
                            {wilayasAndCommunes[wilayaCode].name}{" "}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="inputItem">
                      <span>Commune</span>
                      <select
                        className="selectOptionWilaya"
                        name="selectOptionCommune"
                        id="selectOptionCommune"
                        value={selectedCommune}
                        onChange={handleCommuneChange}
                        disabled={!selectedWilaya}
                      >
                        <option value="" disabled>
                          -- Select Commune --
                        </option>
                        {selectedWilaya &&
                          wilayasAndCommunes[selectedWilaya]?.communes?.map(
                            (commune, index) => (
                              <option key={index} value={commune}>
                                {commune}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                    <div className="inputItem">
                      <span>Address</span>
                      <div className="inputForm">
                        <input type="text" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="deleteContainer flex-col space-y-3">
                  <span className="deleteSpan">Delete Account</span>
                  <div className="bg-white w-full p-3 rounded-m flex space-x-2">
                    <ShieldExclamationIcon className="iconAsideBar" />
                    <p className="uploadSpan">
                      After making a deletion request, you will have
                      <span className="uploadSpanMedium"> "6 months"</span> to
                      maintain this account.
                    </p>
                  </div>
                  <p className="uploadSpan">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Labore assumenda, nisi asperiores officiis ex iusto at, quae
                    aspernatur odio corporis, itaque facere officia totam ullam
                    blanditiis nostrum nihil enim minima.
                  </p>
                  <p className="uploadSpan">
                    There is no reversing this action.
                  </p>
                  <ButtonDelete />
                </div>
              </div>
            </div>
          )}
          {activeTab === "EmailPass" && (
            <div className="flex-col space-y-7">
              <div className="flex items-center justify-between settingsRightHeader">
                <h2 className="pagesTitle">Email & Paasword</h2>
              </div>
            </div>
          )}
          {!activeTab && <div>Please select an option</div>}
        </div>
      </div>
    </div>
  );
}
