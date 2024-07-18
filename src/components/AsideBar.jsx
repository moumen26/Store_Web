import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/16/solid";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Asidebar() {
  const location = useLocation();

  return (
    <aside>
      <ul className="flex-col space-y-7">
        <li>
          <NavLink to="/Dashboard" className="flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Dashboard" ? "asideItemActive" : ""
              }`}
            >
              <Squares2X2Icon className="iconAsideBar" />
              <span className="ml-3">Dashboard</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Products" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Products" ? "asideItemActive" : ""
              }`}
            >
              <Square2StackIcon className="iconAsideBar" />
              <span className="ml-3">Products</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Orders" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Orders" ? "asideItemActive" : ""
              }`}
            >
              <ShoppingBagIcon className="iconAsideBar" />
              <span className="ml-3">Orders</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Customers" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Customers" ? "asideItemActive" : ""
              }`}
            >
              <UserGroupIcon className="iconAsideBar" />
              <span className="ml-3">Customers</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Authentication" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Authentication" ? "asideItemActive" : ""
              }`}
            >
              <UserPlusIcon className="iconAsideBar" />
              <span className="ml-3">User Authentication</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Settings" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Settings" ? "asideItemActive" : ""
              }`}
            >
              <Cog6ToothIcon className="iconAsideBar" />
              <span className="ml-3">Settings</span>
            </div>
          </NavLink>
        </li>
        <li className="absolute bottom-0">
          <NavLink to="/SignIn" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/SignIn" ? "asideItemActive" : ""
              }`}
            >
              <ArrowLeftStartOnRectangleIcon className="iconAsideBar" />
              <span className="ml-3">Log out</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
