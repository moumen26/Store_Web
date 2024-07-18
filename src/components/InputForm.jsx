import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import React from "react";

export default function InputForm({
  inputType,
  labelForm,
  inputPlaceholder,
  inputName,
  setChangevalue,
}) {
  let iconComponent;

  // Determine which icon to use based on labelForm
  switch (inputType) {
    case "email":
      iconComponent = <EnvelopeIcon className="inputIcon" />;
      break;
    case "password":
      iconComponent = <LockClosedIcon className="inputIcon" />;
      break;
    default:
      iconComponent = <EnvelopeIcon className="inputIcon" />;
      break;
  }

  return (
    <div className="inputItem">
      <span>{labelForm}</span>
      <div className="inputForm">
        {iconComponent}
        <input
          type={inputType}
          placeholder={inputPlaceholder}
          name={inputName}
          // onChange={setChangevalue}
        />
      </div>
    </div>
  );
}
