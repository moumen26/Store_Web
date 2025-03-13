import {
  ArchiveBoxIcon,
  ArrowLeftStartOnRectangleIcon,
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
} from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Asidebar() {
  const location = useLocation();

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAchatsOpen, setIsAchatsOpen] = useState(false);

  const handleProductsClick = () => {
    setIsProductsOpen((prevState) => !prevState);
  };

  const handleOrdersClick = () => {
    setIsOrdersOpen((prevState) => !prevState);
  };

  const handleAchatsClick = () => {
    setIsAchatsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".sidebar")) {
      setIsProductsOpen(false);
      setIsOrdersOpen(false);
      setIsAchatsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { logout } = useLogout();

  const submitLogout = () => {
    logout();
  };

  return (
    <aside className="aside">
      <ul className="topAsideBar flex-col space-y-[8px]">
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
        <div className="flex-col space-y-[8px] sidebar">
          <li className="flex-col space-y-[8px]">
            <div className="flex items-center cursor-pointer w-full">
              <div
                className={`flex items-center justify-between itemAsideBar`}
                onClick={handleProductsClick}
              >
                <div className="flex">
                  <ArchiveBoxIcon className="iconAsideBar" />
                  <span className="ml-3">Produits</span>
                </div>
                <ChevronDownIcon
                  className={`iconPages ${isProductsOpen ? "rotate-180" : ""}`}
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
                    <span className="ml-3">Stock de produits</span>
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
                    <span className="ml-3">Grille des produits</span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>
        <div className="flex-col space-y-[8px] sidebar">
          <li className="flex-col space-y-[8px]">
            <div className="flex items-center cursor-pointer">
              <div
                className={`flex items-center justify-between itemAsideBar`}
                onClick={handleOrdersClick}
              >
                <div className="flex">
                  <ShoppingBagIcon className="iconAsideBar" />
                  <span className="ml-3">Commandes</span>
                </div>
                <ChevronDownIcon
                  className={`iconPages ${isOrdersOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {isOrdersOpen && (
              <div className="flex-col space-y-[8px]">
                <NavLink to="/Orders" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/Orders" ? "asideItemActive" : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Dernières commandes</span>
                  </div>
                </NavLink>
                <NavLink
                  to="/Orders/InPreparation"
                  className="flex items-center"
                >
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/Orders/InPreparation"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Commandes en cours</span>
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
                    <span className="ml-3">Commandes à crédit</span>
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
                    <span className="ml-3">Retours de commandes</span>
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
                    <span className="ml-3">Archive des commandes</span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>
        <div className="flex-col space-y-[8px] sidebar">
          <li className="flex-col space-y-[8px]">
            <div className="flex items-center cursor-pointer">
              <div
                className={`flex items-center justify-between itemAsideBar`}
                onClick={handleAchatsClick}
              >
                <div className="flex">
                  <ClipboardDocumentCheckIcon className="iconAsideBar" />
                  <span className="ml-3">Achats</span>
                </div>
                <ChevronDownIcon
                  className={`iconPages ${isAchatsOpen ? "rotate-180" : ""}`}
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
                    <span className="ml-3">Derniers achats</span>
                  </div>
                </NavLink>
                <NavLink to="/CreditPurchases" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/CreditPurchases"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Achats à crédit</span>
                  </div>
                </NavLink>
                <NavLink to="/ReturnsPurchases" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ReturnsPurchases"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Retours d'achats</span>
                  </div>
                </NavLink>
                <NavLink to="/PuchasesArchive" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/PuchasesArchive"
                        ? "asideItemActive"
                        : ""
                    }`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className="ml-3">Archive des achats</span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>
        <li>
          <NavLink to="/Customers" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/Customers" ? "asideItemActive" : ""
              }`}
            >
              <UserGroupIcon className="iconAsideBar" />
              <span className="ml-3">Clients</span>
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
              <span className="ml-3">Vendeurs</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Fournisseurs" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Fournisseurs" ? "asideItemActive" : ""
              }`}
            >
              <UserIcon className="iconAsideBar" />
              <span className="ml-3">Fournisseurs</span>
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
              <span className="ml-3">Authentification utilisateur</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Losses" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Losses" ? "asideItemActive" : ""
              }`}
            >
              <ArrowTrendingDownIcon className="iconAsideBar" />
              <span className="ml-3">Pertes</span>
            </div>
          </NavLink>
        </li>
        <li>
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
      </ul>
    </aside>
  );
}
