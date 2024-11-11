import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ButtonRetour({ buttonSpan, showIcon = true, onClick }) {
  return (
    <button className="buttonExport" onClick={onClick}>
      {showIcon && <ArrowUturnLeftIcon className="iconAsideBar" />}
      <span className="buttonTextDark">{buttonSpan}</span>
    </button>
  );
}
