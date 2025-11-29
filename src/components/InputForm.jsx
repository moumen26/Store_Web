import {
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function InputForm({
  inputType,
  labelForm,
  inputPlaceholder,
  inputName,
  setChangevalue,
  value,
  readOnly,
  language,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Check if this is a password field
  const isPasswordField =
    labelForm === "كلمة المرور" ||
    labelForm === "Mot de passe" ||
    inputType === "password";

  let iconComponent;

  switch (inputType) {
    case "phone":
      iconComponent = <PhoneIcon className="inputIcon" />;
      break;
    case "password":
      iconComponent = <LockClosedIcon className="inputIcon" />;
      break;
    case "email":
      iconComponent = <EnvelopeIcon className="inputIcon" />;
      break;
    default:
      iconComponent = null;
      break;
  }

  switch (inputName) {
    case "phoneNumber":
      iconComponent = <PhoneIcon className="inputIcon" />;
      break;
    case "password":
      iconComponent = <LockClosedIcon className="inputIcon" />;
      break;
    case "email":
      iconComponent = <EnvelopeIcon className="inputIcon" />;
      break;
    default:
      iconComponent = null;
      break;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the actual input type to use
  const actualInputType = isPasswordField && showPassword ? "text" : inputType;

  return (
    <div className="inputItem">
      <span
        className="text-sm md:text-base"
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
      >
        {labelForm}
      </span>
      <div
        className={`inputForm flex flex-col sm:flex-row ${
          language === "ar" ? "gap-x-2" : ""
        }`}
      >
        {/* Main icon (phone, lock, envelope) */}
        {iconComponent}

        <input
          type={actualInputType}
          placeholder={inputPlaceholder}
          name={inputName}
          onChange={setChangevalue}
          value={value}
          readOnly={readOnly}
          min={0}
          className="w-full text-sm md:text-base px-2 py-1 md:px-3 md:py-2"
        />

        {/* Eye icon for password fields */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`eye-toggle ${
              language === "ar" ? "eye-toggle-ar" : "eye-toggle-en"
            }`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0d3a71]" />
            ) : (
              <EyeIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0d3a71]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
