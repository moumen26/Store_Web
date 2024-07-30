import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import ButtonFacebok from "../components/ButtonFacebok";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SignIn() {
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const [error, setError] = useState("");

    //handle username text change
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    //handle password text change
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    //handle login submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
          const reponse = await fetch(import.meta.env.VITE_APP_URL_BASE+"/auth/signin", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ 
              UserName: username, 
              Password: password,
              Type: import.meta.env.VITE_APP_USER_TYPE
            }),
          });
    
          const json = await reponse.json();
    
          if (!reponse.ok) {
            setError(json.message);
            setLoading(false);
          }
          if (reponse.ok) {
            //save the user in local storage
            localStorage.setItem("user", JSON.stringify(json));
            //apdate the auth context
            dispatch({ type: "LOGIN", payload: json }); 
            setLoading(false);    
          }
        }catch (error) {
          console.log(error);
        }
    }
  return (
    <div className="signIn">
      <div className="w-full h-[80px] flex justify-between items-center pl-10 pr-10 border-b-2 border-[#C9E4EE]">
        <h2 className="headerText logoText">Stock</h2>
      </div>
      <div className="signInContainer w-full flex items-center justify-center">
        <div className="signInContainerRightContainer">
          <h2 className="titleText text-center">Log in to Stock</h2>
          <div className="logInForm">
            <form action="">
              <InputForm
                labelForm="Phone Number"
                inputType="phone"
                inputPlaceholder="+213"
                inputName="phoneNumber"
                setChangevalue={handleUsernameChange}
              />
              <InputForm
                labelForm="Password"
                inputType="password"
                inputPlaceholder="Your password"
                inputName="password"
                setChangevalue={handlePasswordChange}
              />
              <a href="">Forgot Password?</a>
              {error && <span className="sign-in-helper-text">{error}</span>}
              <ButtonDark buttonSpan="Log in" setOnClick={handleLoginSubmit} loading={loading}/>
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
    </div>
  );
}
