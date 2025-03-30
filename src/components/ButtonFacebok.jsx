import React from "react";

import FacebokIcon from "../assets/icons/FacebookLight.png";
export default function ButtonFacebok({ language }) {
  return (
    <button className="buttonFacebook">
      <img src={FacebokIcon} alt="Facebook" />
      <span className="buttonTextDark">
        {language === "ar"
          ? "تسجيل الدخول عبر فيسبوك"
          : "Se connecter avec Facebook"}
      </span>
    </button>
  );
}
