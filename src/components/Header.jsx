import {
  ArchiveBoxIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/16/solid";
import {
  BellAlertIcon,
  XMarkIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { NavLink, useLocation } from "react-router-dom";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";

import franceIcon from "/icons/france-icon.png";
import arabicIcon from "/icons/arab-icon.png";

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
      `${import.meta.env.VITE_APP_URL_BASE}/Notification/store/new/${decodedToken.id
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

  // Get notification icon and colors based on type
  const getNotificationTypeConfig = (type) => {
    switch (type) {
      case "subscription_expiry":
        return {
          icon: ExclamationTriangleIcon,
          bgColor: "bg-gradient-to-br from-red-50 to-red-100",
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
        };
      case "store_access_request":
        return {
          icon: ShieldCheckIcon,
          bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          borderColor: "border-blue-200",
          dotColor: "bg-blue-500",
        };
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-100",
          borderColor: "border-yellow-200",
          dotColor: "bg-yellow-500",
        };
    }
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

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last || "U";
  };

  // Generate a consistent color based on user's name
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="Header w-full sm:w-fit flex items-center justify-between mb-2">
      <div
        className={`flex items-center ${language === "ar" ? "gap-x-3 md:gap-x-6" : "space-x-3 md:space-x-6"
          }`}
      >
        {/* Modern Language Selector */}
        <div className="relative">
          <div
            className="flex h-8 md:h-10 items-center justify-center cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 px-2 md:px-3 py-2"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <div
              className={`flex items-center ${language === "ar"
                  ? "gap-x-1 md:gap-x-2"
                  : "space-x-1 md:space-x-2"
                }`}
            >
              <img
                src={currentLanguage?.flag}
                alt={currentLanguage?.name}
                className="w-4 h-4 md:w-5 md:h-5 rounded-sm object-cover"
              />
              <span className="text-gray-700 font-medium text-xs md:text-sm">
                {currentLanguage?.shortName}
              </span>
              <ChevronDownIcon
                className={`w-3 h-3 md:w-4 md:h-4 text-gray-500 transition-transform duration-200 ${showLanguageMenu ? "rotate-180" : ""
                  }`}
              />
            </div>
          </div>

          {/* Language Dropdown */}
          <div
            className={`absolute top-10 md:top-12 ${language === "ar" ? "right-0" : "left-0"
              } w-36 md:w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-30 transform ${showLanguageMenu
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
              } transition-transform duration-200 ease-out`}
          >
            <div className="py-2">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${language === lang.code
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
                      className={`text-xs md:text-sm font-medium ${language === lang.code
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

        {/* Enhanced Notification Icon */}
        <div
          className="relative cursor-pointer group"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group-hover:bg-blue-50">
            <BellAlertIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
          </div>
          {NotificationsByStore?.length > 0 && (
            <>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse">
                {NotificationsByStore.length > 9
                  ? "9+"
                  : NotificationsByStore.length}
              </span>
              {/* Pulsing ring animation */}
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-500 animate-ping opacity-20"></div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Notifications Dropdown */}
      <div
        className={`absolute NotificationsDropDown ${language === "ar"
            ? "right-4 md:right-[320px]"
            : "left-4 md:left-[320px]"
          } top-20 md:top-20 w-[calc(100vw-32px)] sm:w-[420px] md:w-[480px] bg-white shadow-2xl rounded-2xl border border-gray-200 z-20 transform backdrop-blur-sm ${showNotifications
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
          } transition-all duration-300 ease-out`}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-2xl p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div
              className={`flex items-center ${language === "ar" ? "gap-x-3" : "space-x-3"
                }`}
            >
              <div className="p-2 bg-blue-100 rounded-xl">
                <BellAlertIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الإشعارات" : "Notifications"}
                </h3>
                <p className="text-sm text-gray-500">
                  {NotificationsByStore?.length || 0}{" "}
                  {language === "ar" ? "إشعار جديد" : "nouvelles notifications"}
                </p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-white hover:bg-opacity-70 rounded-lg transition-colors duration-200"
              onClick={() => setShowNotifications(false)}
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Notifications Content */}
        <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto">
          {!NotificationsByStoreLoading ? (
            NotificationsByStore?.length > 0 ? (
              <div className="p-2">
                {Object.entries(groupedNotifications || {}).map(
                  ([dateLabel, notifications]) => (
                    <div key={dateLabel} className="mb-4">
                      {/* Date Header */}
                      <div className="flex items-center mb-3 px-2">
                        <div
                          className={`flex items-center ${language === "ar" ? "gap-x-2" : "space-x-2"
                            }`}
                        >
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <h4
                            className="text-gray-600 font-semibold text-sm"
                            style={{
                              fontFamily:
                                language === "ar"
                                  ? "Cairo-Regular, sans-serif"
                                  : "",
                            }}
                          >
                            {dateLabel}
                          </h4>
                        </div>
                        <div className="flex-1 h-px bg-gray-200 ml-3"></div>
                      </div>

                      {/* Notifications List */}
                      <div className="space-y-2">
                        {notifications.map((notif) => {
                          const config = getNotificationTypeConfig(notif.type);
                          const IconComponent = config.icon;

                          return (
                            <div
                              key={notif._id}
                              className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group relative overflow-hidden`}
                            >
                              {/* Background pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white"></div>
                                <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white"></div>
                              </div>

                              <div
                                className={`flex items-start ${language === "ar" ? "gap-x-3" : "space-x-3"
                                  } relative z-10`}
                              >
                                {/* Enhanced Icon */}
                                <div
                                  className={`${config.iconBg} p-3 rounded-xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                                >
                                  <IconComponent
                                    className={`w-5 h-5 ${config.iconColor}`}
                                  />
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-gray-800 text-sm font-medium leading-relaxed mb-2">
                                        {notif.message}
                                      </p>
                                      <div
                                        className={`flex items-center text-xs text-gray-500 ${language === "ar"
                                            ? "gap-x-2"
                                            : "space-x-2"
                                          }`}
                                      >
                                        <span>
                                          {formatTime(notif.createdAt)}
                                        </span>
                                        <div
                                          className={`w-1 h-1 rounded-full ${config.dotColor}`}
                                        ></div>
                                        <span className="capitalize">
                                          {notif.type.replace("_", " ")}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${!submitionLoading
                                          ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                          : "text-red-300 cursor-not-allowed"
                                        }`}
                                      onClick={() =>
                                        handleSubmitMarkNotificationAsRead(
                                          notif._id
                                        )
                                      }
                                      disabled={submitionLoading}
                                    >
                                      {submitionLoading ? (
                                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                                      ) : (
                                        <CheckIcon className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              // Empty state
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <BellAlertIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-gray-600 font-medium mb-2">
                  {language === "ar"
                    ? "لا توجد إشعارات"
                    : "Aucune notification"}
                </h4>
                <p className="text-sm text-gray-500">
                  {language === "ar"
                    ? "سنخبرك عندما يحدث شيء جديد"
                    : "Nous vous informerons quand quelque chose se passe"}
                </p>
              </div>
            )
          ) : (
            // Loading state
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
                <CircularProgress size={24} className="text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">
                {language === "ar" ? "جاري التحميل..." : "Chargement..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced User Info Section */}
      <div className="headerCompte flex items-center relative">
        <div
          className="flex items-center cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 px-2 md:px-3 py-1.5 md:py-2 group"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div
            className={`flex items-center ${language === "ar" ? "gap-x-2" : "space-x-2"
              }`}
          >
            {/* Enhanced Avatar */}
            <div className="relative">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm ${getAvatarColor(
                  user?.infos?.firstName + user?.infos?.lastName
                )} ring-1 ring-white shadow-sm`}
              >
                {getInitials(user?.infos?.firstName, user?.infos?.lastName)}
              </div>
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            {/* User Details */}
            <div className="flex flex-col min-w-0">
              <p
                className="text-gray-900 font-semibold text-xs md:text-sm truncate max-w-[100px] md:max-w-[120px] leading-tight"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {user?.infos?.storeName}
              </p>
              <div
                className={`flex items-center ${language === "ar" ? "gap-x-1" : "space-x-1"
                  }`}
              >
                <span
                  className="text-gray-500 text-xs truncate max-w-[80px] md:max-w-[100px]"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {user?.infos?.phoneNumber}
                </span>
                {/* Status badge */}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {language === "ar" ? "نشط" : "Actif"}
                </span>
              </div>
            </div>
          </div>

          {/* Chevron with enhanced animation */}
          <ChevronDownIcon
            className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-all duration-200 group-hover:text-gray-600 ${language === "ar" ? "mr-1.5 md:mr-2" : "ml-1.5 md:ml-2"
              } ${showUserMenu ? "rotate-180 text-blue-600" : ""}`}
          />
        </div>

        {/* Enhanced User Dropdown Menu */}
        <div
          className={`absolute ${language === "ar" ? "left-0" : "right-0"
            } top-12 md:top-14 w-[240px] md:w-[280px] bg-white shadow-xl rounded-xl border border-gray-200 z-20 transform overflow-hidden
          ${showUserMenu
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
            } transition-all duration-200 ease-out`}
        >
          {/* User Profile Header */}
          <div className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div
              className={`flex items-center ${language === "ar" ? "gap-x-3" : "space-x-3"
                }`}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base ${getAvatarColor(
                  user?.infos?.firstName + user?.infos?.lastName
                )} ring-2 ring-white shadow-md`}
              >
                {getInitials(user?.infos?.firstName, user?.infos?.lastName)}
              </div>
              <div className="flex flex-col min-w-0">
                <p
                  className="text-gray-900 font-bold text-sm md:text-base leading-tight"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {user?.infos?.firstName} {user?.infos?.lastName}
                </p>
                <p
                  className="text-gray-500 text-xs"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {user?.infos?.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1.5">
            <NavLink
              to="/Settings"
              className={`flex items-center ${language === "ar" ? "gap-x-3" : "space-x-3"
                } p-2.5 md:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group`}
              onClick={() => setShowUserMenu(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <Cog6ToothIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <p
                  className="text-gray-800 font-medium text-sm"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الإعدادات" : "Paramètres"}
                </p>
                <p
                  className="text-gray-500 text-xs"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "إدارة حسابك" : "Gérer votre compte"}
                </p>
              </div>
            </NavLink>

            <NavLink
              to="/"
              onClick={submitLogout}
              className={`flex items-center ${language === "ar" ? "gap-x-3" : "space-x-3"
                } p-2.5 md:p-3 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 group`}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                <ArrowLeftStartOnRectangleIcon className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex flex-col">
                <p
                  className="text-red-600 font-medium text-sm"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "تسجيل الخروج" : "Déconnexion"}
                </p>
              </div>
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
