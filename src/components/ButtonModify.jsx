import { PencilIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ButtonModify({ buttonSpan, showIcon = true, onClick }) {
  return (
    <button className="buttonExport" onClick={onClick}>
      {showIcon && <PencilIcon className="iconAsideBar" />}
      <span className="buttonTextDark">{buttonSpan}</span>
    </button>
  );
}
