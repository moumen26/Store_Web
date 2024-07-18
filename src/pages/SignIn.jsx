import React from "react";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import ButtonFacebok from "../components/ButtonFacebok";

export default function SignIn() {
  return (
    <>
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
      </div>
      <div className="signInContainer w-full flex items-center justify-center">
        <div className="signInContainerRightContainer">
          <h2 className="titleText text-center">Log in to Stock</h2>
          <div className="logInForm">
            <form action="">
              <InputForm
                labelForm="Email Address"
                inputType="email"
                inputPlaceholder="example@gmail.com"
                inputName="emailAddress"
              />
              <InputForm
                labelForm="Password"
                inputType="password"
                inputPlaceholder="Your password"
                inputName="password"
              />
              <a href="">Forgot Password?</a>
              <ButtonDark buttonSpan="Log in" />
            </form>
            <div className="orClass">
              <div className="lineOr"></div>
              <span className="orText">or</span>
              <div className="lineOr"></div>
            </div>
            <ButtonFacebok />
            <div className="flex items-center space-x-1">
              <span href="/" className="headerText alreadyText">
                New to Stock?
              </span>
              <a href="/SignUp" className="headerText signInText">
                Sign Up
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
