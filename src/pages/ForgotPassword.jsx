import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ButtonDark from "../components/ButtonDark";
import { useAuthContext } from "../hooks/useAuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Logo from "../assets/Logo-mosagro.png";

export default function ForgotPassword({ onToggle, language, toggleLanguage }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request"); // request, verify, reset
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  // Handle phone number change
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Handle verification code change
  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  // Handle new password change
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  // Handle request reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      showSnackbar(
        language === "ar"
          ? "يرجى إدخال رقم الهاتف"
          : "Veuillez entrer votre numéro de téléphone",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        import.meta.env.VITE_APP_URL_BASE + "/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            PhoneNumber: phoneNumber,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        showSnackbar(json.message, "error");
      } else {
        setStep("verify");
        showSnackbar(
          language === "ar"
            ? "تم إرسال رمز التحقق"
            : "Code de vérification envoyé",
          "success"
        );
      }
    } catch (error) {
      showSnackbar(
        language === "ar"
          ? "حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا"
          : "Une erreur s'est produite. Veuillez réessayer plus tard.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      showSnackbar(
        language === "ar"
          ? "يرجى إدخال رمز التحقق"
          : "Veuillez entrer le code de vérification",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        import.meta.env.VITE_APP_URL_BASE + "/auth/verify-code",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            PhoneNumber: phoneNumber,
            VerificationCode: verificationCode,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        showSnackbar(json.message, "error");
      } else {
        setStep("reset");
        showSnackbar(
          language === "ar" ? "تم التحقق بنجاح" : "Vérification réussie",
          "success"
        );
      }
    } catch (error) {
      showSnackbar(
        language === "ar"
          ? "حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا"
          : "Une erreur s'est produite. Veuillez réessayer plus tard.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showSnackbar(
        language === "ar"
          ? "يرجى ملء جميع الحقول"
          : "Veuillez remplir tous les champs",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Les mots de passe ne correspondent pas",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        import.meta.env.VITE_APP_URL_BASE + "/auth/reset-password",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            PhoneNumber: phoneNumber,
            VerificationCode: verificationCode,
            NewPassword: newPassword,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        showSnackbar(json.message, "error");
      } else {
        showSnackbar(
          language === "ar"
            ? "تم إعادة تعيين كلمة المرور بنجاح"
            : "Mot de passe réinitialisé avec succès",
          "success"
        );

        // Redirect to sign-in page after 2 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      showSnackbar(
        language === "ar"
          ? "حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا"
          : "Une erreur s'est produite. Veuillez réessayer plus tard.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="forgotPassword">
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
      <div className="forgotPasswordContainer w-full h-full flex items-center justify-center">
        <div className="forgotPasswordContainerRightContainer">
          <h2
            className={`titleText text-center ${
              language === "ar" ? "font-cairo-Regular" : ""
            }`}
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "استعادة كلمة المرور"
              : "Récupération du mot de passe"}
          </h2>
          <div
            className={`logInForm ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {step === "request" && (
              <form
                onSubmit={handleRequestReset}
                dir={language === "ar" ? "rtl" : "ltr"}
                className="forgotPasswordForm"
              >
                <p
                  className={`text-gray-600 ${
                    language === "ar" ? "font-cairo-Regular" : ""
                  }`}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "أدخل رقم هاتفك وسنرسل إليك رمز التحقق"
                    : "Entrez votre numéro de téléphone et nous vous enverrons un code de vérification"}
                </p>
                <InputForm
                  labelForm={
                    language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"
                  }
                  inputType="phone"
                  inputPlaceholder="+213"
                  inputName="phoneNumber"
                  setChangevalue={handlePhoneNumberChange}
                  isRtl={language === "ar"}
                  language={language}
                />
                <ButtonDark
                  buttonSpan={
                    language === "ar" ? "إرسال الرمز" : "Envoyer le code"
                  }
                  setOnClick={handleRequestReset}
                  loading={loading}
                  language={language}
                />
              </form>
            )}

            {step === "verify" && (
              <form
                onSubmit={handleVerifyCode}
                dir={language === "ar" ? "rtl" : "ltr"}
                className="forgotPasswordForm"

              >
                <p
                  className={`text-gray-600 ${
                    language === "ar" ? "font-cairo-Regular" : ""
                  }`}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "أدخل رمز التحقق الذي تم إرساله إلى رقم هاتفك"
                    : "Entrez le code de vérification envoyé à votre numéro de téléphone"}
                </p>
                <InputForm
                  labelForm={
                    language === "ar" ? "رمز التحقق" : "Code de vérification"
                  }
                  inputType="text"
                  inputPlaceholder="123456"
                  inputName="verificationCode"
                  setChangevalue={handleVerificationCodeChange}
                  isRtl={language === "ar"}
                  language={language}
                />
                <ButtonDark
                  buttonSpan={language === "ar" ? "تحقق" : "Vérifier"}
                  setOnClick={handleVerifyCode}
                  loading={loading}
                  language={language}
                />
                <div
                  className={`mt-4 flex ${
                    language === "ar" ? "justify-end" : "justify-start"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-blue-600 hover:underline"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar" ? "العودة" : "Retour"}
                  </button>
                </div>
              </form>
            )}

            {step === "reset" && (
              <form
                onSubmit={handleResetPassword}
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <p
                  className={`text-gray-600 ${
                    language === "ar" ? "font-cairo-Regular" : ""
                  }`}
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar"
                    ? "أدخل كلمة المرور الجديدة"
                    : "Entrez votre nouveau mot de passe"}
                </p>
                <InputForm
                  labelForm={
                    language === "ar"
                      ? "كلمة المرور الجديدة"
                      : "Nouveau mot de passe"
                  }
                  inputType="password"
                  inputPlaceholder={
                    language === "ar"
                      ? "كلمة المرور الجديدة"
                      : "Nouveau mot de passe"
                  }
                  inputName="newPassword"
                  setChangevalue={handleNewPasswordChange}
                  isRtl={language === "ar"}
                  language={language}
                />
                <InputForm
                  labelForm={
                    language === "ar"
                      ? "تأكيد كلمة المرور"
                      : "Confirmer le mot de passe"
                  }
                  inputType="password"
                  inputPlaceholder={
                    language === "ar"
                      ? "تأكيد كلمة المرور"
                      : "Confirmer le mot de passe"
                  }
                  inputName="confirmPassword"
                  setChangevalue={handleConfirmPasswordChange}
                  isRtl={language === "ar"}
                  language={language}
                />
                <ButtonDark
                  buttonSpan={
                    language === "ar"
                      ? "إعادة تعيين كلمة المرور"
                      : "Réinitialiser le mot de passe"
                  }
                  setOnClick={handleResetPassword}
                  loading={loading}
                  language={language}
                />
              </form>
            )}

            <div
              className={`flex w-full justify-center items-center mt-6 ${
                language === "ar"
                  ? "flex-row-reverse space-x-reverse"
                  : "space-x-2"
              }`}
            >
              <span className="headerText alreadyText">
                {language === "ar"
                  ? "تذكرت كلمة المرور؟"
                  : "Vous vous souvenez de votre mot de passe ?"}
              </span>
              <a href="/" className="headerText signInText">
                {language === "ar" ? "تسجيل الدخول" : "Se connecter"}
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
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
