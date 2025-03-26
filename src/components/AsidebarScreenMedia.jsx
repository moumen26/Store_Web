import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  Bars3Icon, // Menu icon
  XMarkIcon, // Close icon
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";

export default function AsidebarScreenMedia() {
  const location = useLocation();
  const { logout } = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Keep the sidebar open by default
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAchatsOpen, setIsAchatsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".Sidebar")) {
      setIsSidebarOpen(false);
    }
  };

  const handleProductsClick = () => {
    setIsProductsOpen((prevState) => !prevState);
  };

  const handleOrdersClick = () => {
    setIsOrdersOpen((prevState) => !prevState);
  };

  const handleAchatsClick = () => {
    setIsAchatsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitLogout = () => {
    logout();
  };

  return (
    <div className={`asideMedia ${isSidebarOpen ? "asidemediaActive" : ""}`}
    >
      {/* Toggle Icon for Sidebar */}
      <div className="toggleIcon cursor-pointer" onClick={toggleSidebar}>
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="asidebarMedia">
          <ul className="topAsideBar flex-col space-y-[8px]">
            <li className="Sidebar">
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
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleProductsClick}
                  >
                    <div className="flex">
                      <ArchiveBoxIcon className="iconAsideBar" />
                      <span className="ml-3">Products</span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isProductsOpen && (
                  <div className="flex-col space-y-[8px]">
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
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleOrdersClick}
                  >
                    <div className="flex">
                      <ShoppingBagIcon className="iconAsideBar" />
                      <span className="ml-3">Orders</span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isOrdersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isOrdersOpen && (
                  <div className="flex-col space-y-[8px]">
                    <NavLink to="/Orders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/Orders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Latest Orders</span>
                      </div>
                    </NavLink>
                    <NavLink to="/CreditOrders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/CreditOrders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Credit Orders</span>
                      </div>
                    </NavLink>
                    <NavLink to="/ReturnsOrders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ReturnsOrders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Returns Orders</span>
                      </div>
                    </NavLink>
                    <NavLink to="/OrdersArchive" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/OrdersArchive"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Orders Archive</span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </li>
            </div>
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleAchatsClick}
                  >
                    <div className="flex">
                      <ClipboardDocumentCheckIcon className="iconAsideBar" />
                      <span className="ml-3">Purchases</span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isAchatsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isAchatsOpen && (
                  <div className="flex-col space-y-[8px]">
                    <NavLink to="/Purchases" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/Purchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Latest Purchases</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/CreditPurchases"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/CreditPurchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Credit Purchases</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/ReturnsPurchases"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ReturnsPurchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Returns Purchases</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/PuchasesArchive"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/PuchasesArchive"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">Purchases Archive</span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </li>
            </div>
            <li className="Sidebar">
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
            <li className="Sidebar">
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
            <li className="Sidebar">
              <NavLink to="/Fournisseurs" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Fournisseurs"
                      ? "asideItemActive"
                      : ""
                  }`}
                >
                  <UserIcon className="iconAsideBar" />
                  <span className="ml-3">Fournisseurs</span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Authentication" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Authentication"
                      ? "asideItemActive"
                      : ""
                  }`}
                >
                  <UserPlusIcon className="iconAsideBar" />
                  <span className="ml-3">User Authentication</span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Losses" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Losses" ? "asideItemActive" : ""
                  }`}
                >
                  <ArrowTrendingDownIcon className="iconAsideBar" />
                  <span className="ml-3">Losses</span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Publicite" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Publicite" ? "asideItemActive" : ""
                  }`}
                >
                  <DevicePhoneMobileIcon className="iconAsideBar" />
                  <span className="ml-3">Publicité</span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Settings" className="flex items-center">
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
            <li className="Sidebar">
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
      )}
    </div>
  );
}
