import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function InputFormPassword({
  labelForm,
  inputPlaceholder,
  inputName,
  setChangevalue,
  value,
  readOnly,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="inputItem">
      <span>{labelForm}</span>
      <div className="inputForm">
        <LockClosedIcon className="inputIcon" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={inputPlaceholder}
          name={inputName}
          onChange={setChangevalue}
          value={value}
          readOnly={readOnly}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="eyeIcon"
        >
          {showPassword ? (
            <EyeSlashIcon className="inputIcon" />
          ) : (
            <EyeIcon className="inputIcon" />
          )}
        </button>
      </div>
    </div>
  );
}
