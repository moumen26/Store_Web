import React, { useState, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { CheckCircle2 } from "lucide-react"; // Added for the phone badge
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"; // Added for animation

// Assets
import Logo from "../assets/Logo-mosagro.png";
import franceIcon from "../assets/icons/france-icon.png";
import arabicIcon from "../assets/icons/arab-icon.png";

// Images for the Mockup
import macFrImg from "../assets/images/Dash-fr.png";
import macArImg from "../assets/images/Dash-ar.png";
import phoneImg from "../assets/images/phone.png";

import ButtonFacebok from "../components/ButtonFacebok";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";

export default function SignUp({ onToggle, language, toggleLanguage }) {
  const navigate = useNavigate();

  const [Phone, setPhone] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // --- Parallax Logic (From Landing Page) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 20);
      mouseY.set((clientY / innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Language options
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
  const isRTL = language === "ar";

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
        console.error("Error sending otp: No response received");
      } else {
        console.error("Error sending otp");
      }
    }
  };

  return (
    <div className="w-full fixed top-0 left-0 z-[99] bg-white overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="w-full min-h-[80px] sm:h-[80px] flex justify-between items-center px-4 md:pl-10 md:pr-10 py-4 sm:py-0 border-b-2 border-[#C9E4EE] relative bg-white z-50 max-w-full">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Store Logo" className="h-5 md:h-6" />
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
              className={`absolute top-10 right-0 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-30 transform ${
                showLanguageMenu
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              } transition-transform duration-200 ease-out overflow-hidden`}
              style={{
                maxWidth: "calc(100vw - 2rem)",
                right: language === "ar" ? "0" : "0",
              }}
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

          {/* Sign In Section */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-center sm:text-left ${
              language === "ar" ? "sm:space-x-5" : "sm:space-x-5"
            }`}
          >
            <span
              className="text-[#888888] text-xs sm:text-sm md:text-base"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "لديك حساب بالفعل؟"
                : "Vous avez déjà un compte ?"}
            </span>
            <div
              className={`flex items-center w-fit ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <a
                href="/SignIn"
                className="text-black font-bold w-fit text-xs sm:text-sm md:text-base"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "تسجيل الدخول" : "Se connecter"}
              </a>
              <ChevronRightIcon
                color="#0d3a71"
                className={`w-4 h-4 md:w-5 md:h-5 ${
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
      <div
        className={`w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden max-w-full ${
          language === "ar" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Form Container */}
        <div
          className={`w-full h-full lg:w-1/2 px-[5%] py-[10%] md:py-[3%] ${
            language === "ar" ? "lg:border-l-2" : "lg:border-r-2"
          } border-[#C9E4EE] bg-white`}
        >
          <div
            className={`h-auto flex flex-col gap-6 relative ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <h2
              className="text-4xl md:text-[2.5rem] font-bold leading-snug"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "قم بتوسيع متجرك مع موزاغرو"
                : "Développez votre magasin avec MOSAGRO"}
            </h2>
            <span
              className="text-xs text-[#888888]"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "من إدارة المخزون إلى تتبع الطلبات والتواصل المباشر مع عملائك، يجمع موزاغرو كل عملياتك التجارية في مكان واحد. وفر الوقت، خفض التكاليف، وحسّن إنتاجيتك."
                : "De la gestion des stocks au suivi des commandes et au contact direct avec vos clients, MOSAGRO centralise toutes vos opérations commerciales en un seul endroit. Gagnez du temps, réduisez vos coûts et améliorez votre productivité."}
            </span>

            <div
              className={
                language === "ar" ? "flex justify-end" : "flex justify-start"
              }
            >
              <InputForm
                labelForm={
                  language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"
                }
                inputType="number"
                inputPlaceholder="+213"
                inputName="phoneNumber"
                value={Phone}
                language={language}
                setChangevalue={handlePhoneChange}
              />
            </div>

            <div
              className={
                language === "ar" ? "flex justify-end" : "flex justify-start"
              }
            >
              <ButtonDark
                buttonSpan={
                  language === "ar"
                    ? "ابدأ الآن - مجانًا"
                    : "Commencer - Gratuitement"
                }
                language={language}
                setOnClick={handleClickOpenConfirmationDialog}
              />
            </div>
          </div>
        </div>

        {/* --- IMAGE/MOCKUP SECTION --- */}
        <div className="hidden lg:!flex lg:w-1/2 h-full relative items-center justify-center overflow-hidden">
          {/* Mockup Container */}
          <div className="relative z-10 w-full max-w-[600px] h-[400px] flex items-center justify-center px-8">
            {/* Platform (MacBook) - Back */}
            <motion.div
              style={{ x: xSpring, y: ySpring }}
              className={`absolute ${
                isRTL ? "-left-20" : "-right-20"
              } z-10 w-[95%] transform perspective-1000`}
            >
              <div className="bg-[#C9E4EE] rounded-lg p-[1px] shadow-sm border border-[#C9E4EE]">
                <div className="relative aspect-[16/10] bg-[#C9E4EE] rounded-lg overflow-hidden border-b border-[#C9E4EE]">
                  <img
                    src={language === "fr" ? macFrImg : macArImg}
                    alt="Dashboard"
                    className="w-full h-full object-fill object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleSendOTP}
        dialogTitle={
          language === "ar"
            ? "تأكيد إنشاء الحساب"
            : "Confirmer la création du compte"
        }
        language={language}
        dialogContentText={
          language === "ar"
            ? `هل أنت متأكد أنك تريد إنشاء حساب متجر جديد بهذا الرقم: ${Phone}؟`
            : `Êtes-vous sûr de vouloir créer un compte de magasin avec ce numéro de téléphone : ${Phone} ?`
        }
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
