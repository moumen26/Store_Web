import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/16/solid";
import {
  BellAlertIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user } = useAuthContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { logout } = useLogout();

  const submitLogout = () => {
    logout();
  };

  const notifications = [
    { id: 1, message: "New order received!", time: "2 min ago" },
    { id: 2, message: "Your profile was updated.", time: "10 min ago" },
    { id: 3, message: "System maintenance at 3 AM.", time: "1 hour ago" },
    { id: 4, message: "New feature released!", time: "3 hours ago" },
  ];

  return (
    <div className="Header relative flex items-center space-x-6">
      {/* Notification Icon */}
      <div
        className="relative cursor-pointer p-2 bg-gray-100 rounded-full"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <BellAlertIcon className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-[-4px] right-[-3px] bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Notifications Dropdown */}
      <div
        className={`absolute right-[455px] top-0 w-[350px] bg-white shadow-lg rounded-xl border border-gray-200 z-20 transform
        ${
          showNotifications
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        } transition-transform duration-200 ease-out`}
      >
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
          <XMarkIcon
            className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowNotifications(false)}
          />
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 p-4 pt-0">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 flex items-center space-x-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                  🔔
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-800 text-sm font-medium">
                    {notif.message}
                  </p>
                  <span className="text-gray-500 text-xs">{notif.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              No new notifications
            </p>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center relative">
        <div
          className="flex items-center cursor-pointer justify-between w-[300px]"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="flex space-x-3 items-center">
            <div className="w-[48px] h-[48px] rounded-full bg-slate-500"></div>
            <div className="flex flex-col">
              <p className="text-gray-800 font-medium text-[14px]">
                {user?.infos?.storeName}
              </p>
              <span className="text-gray-500 text-sm">
                {user?.infos?.phoneNumber}
              </span>
            </div>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-gray-600" />
        </div>

        <div
          className={`absolute right-0 top-12 w-[250px] bg-white shadow-lg rounded-xl border border-gray-200 z-20 transform
          ${
            showUserMenu
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          } transition-transform duration-200 ease-out`}
        >
          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-800 font-semibold">
              {user?.infos?.firstName} {user?.infos?.lastName}
            </p>
            <span className="text-gray-500 text-sm">{user?.infos?.email}</span>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <NavLink
              to="/Settings"
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              <p className="text-gray-700 text-sm">Settings</p>
            </NavLink>
            <NavLink
              to="/"
              onClick={submitLogout}
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">Logout</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
