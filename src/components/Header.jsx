import {
  ArchiveBoxIcon,
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
import { NavLink, useLocation } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";

import franceIcon from "../assets/icons/france-icon.png";
import arabicIcon from "../assets/icons/arab-icon.png";

export default function Header({ language, toggleLanguage }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { logout } = useLogout();

  const submitLogout = () => {
    logout();
  };

  //fetch data
  const notificationSound = new Audio("/notification.mp3");

  const fetchNotificationsByStore = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Notification/store/new/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving notifications data for this store");
      }
    }

    const data = await response.json();

    if (data.length > 0) {
      notificationSound.play();
    }

    return data;
  };

  // useQuery hook to fetch data
  const {
    data: NotificationsByStore,
    error: NotificationsByStoreError,
    isLoading: NotificationsByStoreLoading,
    refetch: refetchNotificationsByStore,
  } = useQuery({
    queryKey: ["NotificationsByStore", user?.token, location.key],
    queryFn: fetchNotificationsByStore,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // enable refetch on window focus (optional)
    staleTime: 1000 * 60, // Data is fresh for 1 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmitMarkNotificationAsRead = async (val) => {
    if (submitionLoading) return;
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Notification/asRead/${val}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        refetchNotificationsByStore();
      } else {
        setAlertType(true);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType(true);
        setSnackbarMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error mark as read notification: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error mark as read notification");
      }
    }
  };

  const formatDate = (date, language) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateObj = new Date(date);
    if (dateObj.toDateString() === today.toDateString()) {
      return language === "ar" ? "اليوم" : "Aujourd'hui";
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      return language === "ar" ? "أمس" : "Hier";
    } else {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return dateObj.toLocaleDateString(
        language === "ar" ? "ar-FR" : "fr-FR",
        options
      );
    }
  };

  const formatTime = (date) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(date).toLocaleTimeString("fr-FR", options);
  };

  // Group notifications by formatted date
  const groupedNotifications = NotificationsByStore?.reduce((acc, notif) => {
    const formattedDate = formatDate(notif.createdAt, language);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(notif);
    return acc;
  }, {});

  // Language options with flags
  const languageOptions = [
    {
      code: "fr",
      name: "Français",
      flag: franceIcon,
      shortName: "FR",
    },
    {
      code: "ar",
      name: "العربية",
      flag: arabicIcon,
      shortName: "AR",
    },
  ];

  const currentLanguage = languageOptions.find(
    (lang) => lang.code === language
  );

  return (
    <div className="Header flex items-center justify-between px-4 py-2 md:px-6 md:py-3 w-full">
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Modern Language Selector */}
        <div className="relative">
          <div
            className="flex h-8 md:h-10 items-center justify-center cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 px-2 md:px-3 py-2"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <div className="flex items-center space-x-1 md:space-x-2">
              <img
                src={currentLanguage?.flag}
                alt={currentLanguage?.name}
                className="w-4 h-4 md:w-5 md:h-5 rounded-sm object-cover"
              />
              <span className="text-gray-700 font-medium text-xs md:text-sm">
                {currentLanguage?.shortName}
              </span>
              <ChevronDownIcon
                className={`w-3 h-3 md:w-4 md:h-4 text-gray-500 transition-transform duration-200 ${
                  showLanguageMenu ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Language Dropdown */}
          <div
            className={`absolute top-10 md:top-12 ${
              language === "ar" ? "right-0" : "left-0"
            } w-36 md:w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-30 transform ${
              showLanguageMenu
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            } transition-transform duration-200 ease-out`}
          >
            <div className="py-2">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                    language === lang.code
                      ? "bg-blue-50 border-r-2 border-blue-500"
                      : ""
                  } ${language === "ar" ? "gap-x-2 md:gap-x-3" : ""}`}
                  onClick={() => {
                    toggleLanguage(lang.code);
                    setShowLanguageMenu(false);
                  }}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-4 h-4 md:w-5 md:h-5 rounded-sm object-cover"
                  />
                  <div className="flex flex-col">
                    <span
                      className={`text-xs md:text-sm font-medium ${
                        language === lang.code
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                      style={{
                        fontFamily:
                          lang.code === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {lang.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lang.shortName}
                    </span>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Icon */}
        <div
          className="relative cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <BellAlertIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          {NotificationsByStore?.length > 0 && (
            <span className="absolute top-[-2px] right-[-2px] md:top-[-4px] md:right-[-3px] bg-red-500 text-white text-[9px] md:text-[10px] w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full">
              {NotificationsByStore.length}
            </span>
          )}
        </div>
      </div>

      {/* Notifications Dropdown */}
      <div
        className={`absolute NotificationsDropDown ${
          language === "ar"
            ? "right-4 md:right-[375px]"
            : "left-4 md:left-[375px]"
        } top-12 md:top-16 w-[calc(100vw-32px)] sm:w-[400px] md:w-[450px] bg-white shadow-lg rounded-xl border border-gray-200 z-20 transform ${
          showNotifications
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        } transition-transform duration-200 ease-out`}
      >
        <div className="flex justify-between items-center p-3 md:p-4">
          <h3
            className="text-base md:text-lg font-semibold text-gray-700"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "الإشعارات" : "Notifications"}
          </h3>
          <XMarkIcon
            className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowNotifications(false)}
          />
        </div>

        <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto space-y-2 p-3 md:p-4 pt-0">
          {!NotificationsByStoreLoading ? (
            Object.entries(groupedNotifications || {}).map(
              ([dateLabel, notifications]) => (
                <div key={dateLabel}>
                  <h4 className="text-gray-700 font-semibold text-xs md:text-sm mb-2">
                    {dateLabel}
                  </h4>
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="p-2 md:p-3 flex items-center space-x-2 md:space-x-4 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex space-x-2 md:space-x-3 w-[90%] md:w-[95%] items-center">
                        <div
                          className={`notifTypeIcon w-1 h-10 md:h-14 rounded-full flex items-center justify-center
                    ${
                      notif.type === "subscription_expiry"
                        ? "bg-red-200"
                        : notif.type === "store_access_request"
                        ? "bg-blue-200"
                        : "bg-yellow-200"
                    }
                  `}
                        ></div>

                        <div className="flex flex-col w-[90%] md:w-[95%]">
                          <p className="text-gray-800 text-xs md:text-sm font-medium">
                            {notif.message}
                          </p>
                          <span className="text-gray-500 text-xs">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <ArchiveBoxIcon
                          className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors duration-200 ${
                            !submitionLoading
                              ? "text-gray-300 hover:text-red-500"
                              : "text-red-300"
                          }`}
                          onClick={() =>
                            handleSubmitMarkNotificationAsRead(notif._id)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CircularProgress color="inherit" size={20} />
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="headerCompte flex items-center relative">
        <div
          className="flex items-center cursor-pointer justify-between w-full sm:w-[250px] md:w-[300px]"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div
            className={`flex items-center space-x-2 md:space-x-3 ${
              language === "ar" ? "gap-x-2 md:gap-x-3" : ""
            }`}
          >
            <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-slate-500"></div>
            <div className="flex flex-col">
              <p
                className="text-gray-800 font-medium text-xs md:text-sm truncate max-w-[120px] md:max-w-[180px]"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {user?.infos?.storeName}
              </p>
              <span
                className="text-gray-500 text-xs md:text-sm"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {user?.infos?.phoneNumber}
              </span>
            </div>
          </div>
          <ChevronDownIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </div>

        <div
          className={`absolute right-0 top-12 md:top-16 w-[200px] md:w-[250px] bg-white shadow-lg rounded-xl border border-gray-200 z-20 transform
          ${
            showUserMenu
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          } transition-transform duration-200 ease-out`}
        >
          {/* User Info */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <p
              className="text-gray-800 font-semibold text-sm md:text-base"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {user?.infos?.firstName} {user?.infos?.lastName}
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <NavLink
              to="/Settings"
              className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
                language === "ar" ? "gap-x-2 md:gap-x-3" : ""
              }`}
            >
              <Cog6ToothIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              <p
                className="text-gray-700 text-xs md:text-sm"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الإعدادات" : "Paramètres"}
              </p>
            </NavLink>
            <NavLink
              to="/"
              onClick={submitLogout}
              className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
                language === "ar" ? "gap-x-2 md:gap-x-3" : ""
              }`}
            >
              <ArrowLeftStartOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              <p
                className="text-red-600 text-xs md:text-sm"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "تسجيل الخروج" : "Déconnexion"}
              </p>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertType ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Click outside handler to close dropdowns */}
      {(showLanguageMenu || showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowLanguageMenu(false);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
}
