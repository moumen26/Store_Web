import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Asidebar({ language }) {
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
    <aside className={`aside ${language === "ar" ? "rtl" : ""}`}>
      <ul className="topAsideBar flex-col space-y-[8px]">
        <li>
          <NavLink to="/Dashboard" className="flex items-center">
            <div
              className={`flex items-center itemAsideBar ${
                location.pathname === "/" || location.pathname === "/Dashboard"
                  ? "asideItemActive"
                  : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Squares2X2Icon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Dashboard" : "الرئيسية"}
              </span>
            </div>
          </NavLink>
        </li>
        <div className="flex-col space-y-[8px] sidebar">
          <li className="flex-col space-y-[8px]">
            <div className="flex items-center cursor-pointer w-full">
              <div
                className={`flex items-center justify-between itemAsideBar ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
                onClick={handleProductsClick}
              >
                <div
                  className={`flex ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <ArchiveBoxIcon className="iconAsideBar" />
                  <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                    {language === "fr" ? "Produits" : "المنتجات"}
                  </span>
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
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Stock de produits"
                        : "مخزون المنتجات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/ProductsGrid" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ProductsGrid"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Grille des produits"
                        : "شبكة المنتجات"}
                    </span>
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
                className={`flex items-center justify-between itemAsideBar ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
                onClick={handleOrdersClick}
              >
                <div
                  className={`flex ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  {" "}
                  <ShoppingBagIcon className="iconAsideBar" />
                  <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                    {language === "fr" ? "Commandes" : "الطلبات"}
                  </span>
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
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Dernières commandes"
                        : "أحدث الطلبات"}
                    </span>
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
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Commandes en cours"
                        : "الطلبات قيد التحضير"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/CreditOrders" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/CreditOrders"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Commandes à crédit"
                        : "الطلبات بالائتمان"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/ReturnsOrders" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ReturnsOrders"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Commandes de retour"
                        : "طلبات الإرجاع"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/OrdersArchive" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/OrdersArchive"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Archive des commandes"
                        : "أرشيف الطلبات"}
                    </span>
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
                className={`flex items-center justify-between itemAsideBar ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
                onClick={handleAchatsClick}
              >
                <div
                  className={`flex ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  {" "}
                  <ClipboardDocumentCheckIcon className="iconAsideBar" />
                  <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                    {language === "fr" ? "Achats" : "المشتريات"}
                  </span>
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
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr" ? "Derniers achats" : "أحدث المشتريات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/CreditPurchases" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/CreditPurchases"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Achats à crédit"
                        : "المشتريات بالائتمان"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/ReturnsPurchases" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/ReturnsPurchases"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Retours d'achats"
                        : "إرجاع المشتريات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink to="/PuchasesArchive" className="flex items-center">
                  <div
                    className={`flex items-center itemAsideBar ${
                      location.pathname === "/PuchasesArchive"
                        ? "asideItemActive"
                        : ""
                    } ${language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Square2StackIcon className="iconAsideBar opacity-0" />
                    <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                      {language === "fr"
                        ? "Archive des achats"
                        : "أرشيف المشتريات"}
                    </span>
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
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <UserGroupIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Clients" : "العملاء"}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Vendors" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Vendors" ? "asideItemActive" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <UsersIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Vendeurs" : "البائعين"}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Fournisseurs" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Fournisseurs" ? "asideItemActive" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <UserIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Fournisseurs" : "الموردين"}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Authentication" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Authentication" ? "asideItemActive" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <UserPlusIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr"
                  ? "Authentification utilisateur"
                  : "مصادقة المستخدم"}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Losses" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Losses" ? "asideItemActive" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <ArrowTrendingDownIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Pertes" : "الخسائر"}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Publicite" className=" flex items-center">
            <div
              className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                location.pathname === "/Publicite" ? "asideItemActive" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <DevicePhoneMobileIcon className="iconAsideBar" />
              <span className={`ml-3 ${language === "ar" ? "mr-3" : ""}`}>
                {language === "fr" ? "Publicité" : "الإعلانات"}
              </span>
            </div>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
