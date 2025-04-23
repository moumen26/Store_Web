import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function RetireButton({
  buttonSpan,
  showIcon = true,
  onClick,
  language,
}) {
  return (
    <button className="buttonExport" onClick={onClick}>
      {showIcon && <ArrowUturnLeftIcon className="iconAsideBar" />}
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
