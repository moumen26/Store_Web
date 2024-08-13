import React, { useState } from "react";
import ButtonDark from "../components/ButtonDark";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", ""]);

  const handleChange = (value, index) => {
    if (value.match(/^[0-9]$/) || value === "") {
      // Ensure only numeric values are allowed
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input if the current one is filled
      if (value !== "" && index < 3) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    // Combine code into a single string and handle verification
    const verificationCode = code.join("");
    console.log("Verification Code Entered:", verificationCode);
    // Perform verification action (e.g., API call)
  };

  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/UpYourAccount`);
  };

  return (
    <div className="signIn">
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
      </div>
      <div className="signInContainer w-full flex items-center justify-center">
        <div className="signInContainerRightContainer">
          <div>
            <h2 className="titleText text-center">Verify Code</h2>
            <div className="flexCol items-center">
              <span className="text-[#888888]">
                Please enter the code we just sent to number
              </span>
              <span className="text-blue-500 text-center">+213</span>
            </div>
          </div>
          <div className="flex justify-center space-x-8 mt-10">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-16 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#26667E]"
              />
            ))}
          </div>
          <div className="flexCol">
            <span className="text-[#888888] text-center">
              Didn’t receive OTP?
            </span>
            <a href="" className="text-center">
              Resend code ?
            </a>
          </div>
          <div className="mt-6 w-full">
            <ButtonDark
              buttonSpan="Verify"
              setOnClick={handleViewClick}
              // setOnClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
