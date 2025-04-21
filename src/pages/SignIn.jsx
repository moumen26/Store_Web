import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import ButtonFacebok from "../components/ButtonFacebok";
import { useAuthContext } from "../hooks/useAuthContext";
import Snackbar from "@mui/material/Snackbar";
import Logo from "../assets/Logo-mosagro.png";

import Alert from "@mui/material/Alert";

export default function SignIn({ onToggle, language, toggleLanguage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle username text change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Handle password text change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_URL_BASE + "/auth/signin/store",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            UserName: username,
            Password: password,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setSnackbarMessage(json.message);
        setSnackbarOpen(true);
        setLoading(false);
      } else {
        // Save the user in local storage
        localStorage.setItem("user", JSON.stringify(json));
        // Update the auth context
        dispatch({ type: "LOGIN", payload: json });
        setLoading(false);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again later.");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="signIn">
      <div
        className={`w-full h-[80px] flex justify-start items-center border-b-2 border-[#a] ${
          language === "ar" ? "flex-row-reverse gap-x-2" : "space-x-2"
        }`}
        style={{
          paddingLeft: language === "ar" ? "0" : "2.5rem",
          paddingRight: language === "ar" ? "2.5rem" : "0",
        }}
      >
        <div
          className={`flex items-center ${
            language === "ar" ? "flex-row-reverse gap-x-2" : "space-x-2"
          }`}
        >
          <img src={Logo} alt="Store Logo" className="h-8" />
          <h2
            className={`logoText ${
              language === "ar" ? "font-cairo-Regular" : ""
            }`}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "موساجرو" : "MOSAGRO"}
          </h2>
        </div>
      </div>
      <div className="signInContainer w-full flex items-center justify-center">
        <div className="signInContainerRightContainer">
          <h2
            className={`titleText text-center ${
              language === "ar" ? "font-cairo-Regular" : ""
            }`}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "تسجيل الدخول" : "Connectez-vous"}
          </h2>
          <div
            className={`logInForm ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <form
              onSubmit={handleLoginSubmit}
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <InputForm
                labelForm={
                  language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"
                }
                inputType="phone"
                inputPlaceholder="+213"
                inputName="phoneNumber"
                setChangevalue={handleUsernameChange}
                isRtl={language === "ar"}
                language={language}
              />
              <InputForm
                labelForm={language === "ar" ? "كلمة المرور" : "Mot de passe"}
                inputType="password"
                inputPlaceholder="Your password"
                inputName="password"
                setChangevalue={handlePasswordChange}
                isRtl={language === "ar"}
                language={language}
              />
              <div
                className={`w-full flex ${
                  language === "ar" ? "justify-start" : "justify-end"
                }`}
              >
                <a
                  href=""
                  className="forgotPasswordText"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "نسيت كلمة المرور؟"
                    : "Mot de passe oublié ?"}
                </a>
              </div>
              <ButtonDark
                buttonSpan={language === "ar" ? "تسجيل الدخول" : "Se connecter"}
                setOnClick={handleLoginSubmit}
                loading={loading}
                language={language}
              />
            </form>
            <div className="orClass">
              <div className="lineOr"></div>
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="orText"
              >
                {language === "ar" ? "أو" : "or"}
              </span>
              <div className="lineOr"></div>
            </div>
            <ButtonFacebok language={language} />
            <div
              className={`flex w-full justify-center items-center ${
                language === "ar"
                  ? "flex-row-reverse space-x-reverse"
                  : "space-x-2"
              }`}
            >
              <span href="/" className="headerText alreadyText">
                {language === "ar"
                  ? "جديد في موساجرو؟"
                  : "Nouveau sur MOSAGRO ?"}
              </span>
              <a href="/SignUp" className="headerText signInText">
                {language === "ar" ? "إنشاء حساب" : "S'inscrire"}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: language === "ar" ? "left" : "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
