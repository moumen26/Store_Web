import { PencilIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ButtonModify({
  buttonSpan,
  showIcon = true,
  onClick,
  language,
}) {
  return (
    <button className="buttonExport" onClick={onClick}>
      {showIcon && <PencilIcon className="iconAsideBar" />}
      <span
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextDark"
      >
        {buttonSpan}
      </span>
    </button>
  );
}
