import { ChevronRightIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import ButtonFacebok from "../components/ButtonFacebok";
import { useAuthContext } from "../hooks/useAuthContext";
import Snackbar from "@mui/material/Snackbar";
import Logo from "../assets/Logo-mosagro.png";
import franceIcon from "../assets/icons/france-icon.png";
import arabicIcon from "../assets/icons/arab-icon.png";

import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export default function SignIn({ onToggle, language, toggleLanguage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const navigate = useNavigate();

  // Language options with flags
  const languageOptions = [
    {
      code: "fr",
      name: "Français",
      flag: franceIcon,
      shortName: "FR",
    },
    {
      code: "ar",
      name: "العربية",
      flag: arabicIcon,
      shortName: "AR",
    },
  ];

  const currentLanguage = languageOptions.find(
    (lang) => lang.code === language
  );

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

  const navigateTo = (val) => {
    navigate(val);
  };

  return (
    <div className="signIn">
      {/* Header */}
      <div className="w-full min-h-[80px] sm:h-[80px] flex justify-between items-center px-4 md:pl-10 md:pr-10 py-4 sm:py-0 border-b-2 border-[#C9E4EE] relative">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Store Logo" className="h-5 md:h-6" />
          {/* <h2 className="headerText logoText">MOSAGRO</h2> */}
        </div>

        <div className="flex items-center gap-6">
          {/* Language Dropdown */}
          <div className="relative">
            <div
              className="flex h-8 items-center justify-center cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 px-3 py-2"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={currentLanguage?.flag}
                  alt={currentLanguage?.name}
                  className="w-4 h-4 rounded-sm object-cover"
                />
                <span className="text-gray-700 font-medium text-sm">
                  {currentLanguage?.shortName}
                </span>
                <ChevronRightIcon
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showLanguageMenu ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            {/* Language Dropdown Menu */}
            <div
              className={`absolute top-10 ${
                language === "ar" ? "right-0" : "right-0"
              } w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-30 transform ${
                showLanguageMenu
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              } transition-transform duration-200 ease-out`}
            >
              <div className="py-2">
                {languageOptions.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                      language === lang.code
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    } ${language === "ar" ? "gap-x-3" : "gap-x-3"}`}
                    onClick={() => {
                      toggleLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.name}
                      className="w-5 h-5 rounded-sm object-cover"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          language === lang.code
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                        style={{
                          fontFamily:
                            lang.code === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {lang.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lang.shortName}
                      </span>
                    </div>
                    {language === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Up Section */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-center sm:text-left ${
              language === "ar" ? "sm:space-x-5" : "sm:space-x-5"
            }`}
          >
            <span
              className="headerText alreadyText text-xs sm:text-sm md:text-base"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "جديد في موساجرو؟" : "Nouveau sur MOSAGRO ?"}
            </span>
            <div
              className={`flex items-center w-fit ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <a
                href="/SignUp"
                className="headerText signInText text-xs sm:text-sm md:text-base"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "إنشاء حساب" : "S'inscrire"}
              </a>
              <ChevronRightIcon
                color="#0d3a71"
                className={`iconAsideBar w-4 h-4 md:w-5 md:h-5 ${
                  language === "ar" ? "mr-1" : "ml-1"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Click outside handler */}
        {showLanguageMenu && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowLanguageMenu(false)}
          />
        )}
      </div>

      {/* Main Content */}
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
                inputPlaceholder={
                  language === "ar"
                    ? "كلمة المرور الخاصة بك"
                    : "Votre mot de passe"
                }
                inputName="password"
                setChangevalue={handlePasswordChange}
                language={language}
              />
              

              <div
                className={`w-full flex ${
                  language === "ar" ? "justify-start" : "justify-end"
                }`}
              >
                <span
                  className=" text-right"
                  onClick={() => navigateTo("/ForgotPassword")}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    cursor: "pointer",
                  }}
                >
                  {language === "ar"
                    ? "نسيت كلمة المرور؟"
                    : "Mot de passe oublié ?"}
                </span>
              </div>
              <ButtonDark
                buttonSpan={language === "ar" ? "تسجيل الدخول" : "Se connecter"}
                setOnClick={handleLoginSubmit}
                loading={loading}
                language={language}
              />
            </form>
            {/* <div className="orClass">
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
            </div> */}
            {/* <ButtonFacebok language={language} /> */}
            {/* <div
              className={`flex w-full justify-center items-center ${
                language === "ar"
                  ? "flex-row-reverse space-x-reverse"
                  : "space-x-2"
              }`}
            >
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                href="/"
                className="headerText alreadyText"
              >
                {language === "ar"
                  ? "جديد في موساجرو؟"
                  : "Nouveau sur MOSAGRO ?"}
              </span>
              <span
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  cursor: "pointer",
                }}
                onClick={() => navigateTo("/SignUp")}
                className="headerText signInText"
              >
                {language === "ar" ? "إنشاء حساب" : "S'inscrire"}
              </span>
            </div> */}
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
