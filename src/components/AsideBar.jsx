import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Asidebar() {
  const location = useLocation();

  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const handleProductsClick = () => {
    setIsProductsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".sidebar")) {
      setIsProductsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { logout } = useLogout();
  //handle logout
  const submitLogout = () => {
    logout();
  };
  return (
    <aside>
      <ul className="flex-col space-y-7">
        <li>
          <NavLink to="/AddOrder" className="flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/AddOrder" ? "asideItemActive" : ""
              }`}
            >
              <Squares2X2Icon className="iconAsideBar" />
              <span className="ml-3">Dashboard</span>
            </div>
          </NavLink>
        </li>
        <div className="flex-col space-y-7 sidebar">
          <li className="flex-col space-y-7">
            <div className="flex items-center cursor-pointer">
              <div
                className={`flex items-center justify-between itemAsideBar ${
                  location.pathname === "/Products" ? "asideItemActive" : ""
                }`}
                onClick={handleProductsClick}
              >
                <div className="flex">
                  <Square2StackIcon className="iconAsideBar" />
                  <span className="ml-3">Products</span>
                </div>
                <ChevronDownIcon
                  className={`iconPages ${isProductsOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {isProductsOpen && (
              <div className="flex-col space-y-7">
                <NavLink to="/ProductsList" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ProductsList"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Products Stock</span>
                  </div>
                </NavLink>
                <NavLink to="/ProductsGrid" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ProductsGrid"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Products Grid</span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>
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
          <NavLink to="/Vendors" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Vendors" ? "asideItemActive" : ""
              }`}
            >
              <UsersIcon className="iconAsideBar" />
              <span className="ml-3">Vendors</span>
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
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
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
        <li>
          <NavLink
            to="/SignUp"
            className=" flex items-center"
            onClick={submitLogout}
          >
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/SignUp" ? "asideItemActive" : ""
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
