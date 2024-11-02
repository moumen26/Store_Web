import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Header() {
  return (
    <div className="Header">
      <BellAlertIcon className="iconPages" />
      <div className="HeaderContainer w-[300px]">
        <div className="HeaderContainer space-x-4">
          <div className="w-[48px] h-[48px] rounded-[50%] bg-slate-500"></div>
          <div className="HeaderInfo flex-col space-y-1">
            <p className="headerP">Hichem Alimentation</p>
            <span className="headerSpan">+213 550 18 90 87</span>
          </div>
        </div>
        <ChevronDownIcon className="iconPages" />
      </div>
    </div>
  );
}
