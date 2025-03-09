import { PlusIcon } from "@heroicons/react/16/solid";
import React from "react";

export default function ButtonAdd({ buttonSpan, showIcon = true, onClick }) {
  const getButtonBgColor = () => {
    switch (buttonSpan) {
      case "Make it undeposit":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Make it credited":
        return "bg-green-500 hover:bg-green-600";
      case "Make it uncredited":
        return "bg-red-500 hover:bg-red-600";
      case "Add payment":
        return "bg-blue-500 hover:bg-blue-600";
      case "Full payment":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-[#26667e] hover:bg-[#1f556b]";
    }
  };

  return (
    <button className={`buttonAdd ${getButtonBgColor()}`} onClick={onClick}>
      {showIcon && <PlusIcon className="iconAsideBar" />}
      <span className="buttonTextLight">{buttonSpan}</span>
    </button>
  );
}
