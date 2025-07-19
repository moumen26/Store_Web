import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useLocation, useParams } from "react-router-dom";
import CustomerPrimaryDelivery from "../components/CustomerPrimaryDelivery";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { TokenDecoder } from "../util/DecodeToken";
import { EqualsIcon } from "@heroicons/react/16/solid";
import { ChevronLeftIcon } from "lucide-react";

export default function NonApprovedCustomer({
  onToggle,
  language,
  toggleLanguage,
}) {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();

  // fetching CustomerData data
  const fetchCustomerData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Client/${id}/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Customer data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: CustomerData,
    error: CustomerDataError,
    isLoading: CustomerDataLoading,
    refetch: CustomerDataRefetch,
  } = useQuery({
    queryKey: ["CustomerData", user?.token, location.key, id],
    queryFn: fetchCustomerData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  if (CustomerDataLoading) {
    return (
      <div
        className="pagesContainer"
        style={{ direction: language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>
        <div className="flex items-center justify-center h-64">
          <CircularProgress color="inherit" />
        </div>
      </div>
    );
  }

  if (CustomerDataError) {
    return (
      <div
        className="pagesContainer"
        style={{ direction: language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>
        <div className="customerClass">
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "لا توجد بيانات متاحة"
              : "Aucune donnée disponible"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="flexHeader">
        <div onClick={onToggle} className="equalsIcon">
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header toggleLanguage={toggleLanguage} language={language} />
      </div>

      <div className="w-full flex items-center justify-between">
        <div
          className={`flex items-center ${
            language === "ar" ? "space-x-reverse space-x-1" : "space-x-1"
          }`}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "العملاء" : "Clients"}
          </span>
          {language === "ar" ? (
            <ChevronLeftIcon className="iconAsideBar" />
          ) : (
            <ChevronRightIcon className="iconAsideBar" />
          )}{" "}
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            #{CustomerData?._id}
          </span>
        </div>
      </div>

      <div className="customerClass">
        <h2
          className="customerClassTitle"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "ar"
            ? "المعلومات الشخصية"
            : "Informations personnelles"}
        </h2>
        <div className="personalInformation">
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الاسم" : "Prénom"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.firstName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "اللقب" : "Nom"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.lastName}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.phoneNumber}
            </h3>
          </div>
          {CustomerData?.email && (
            <div className="flex-col">
              <span
                className="personalInformationSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "عنوان البريد الإلكتروني"
                  : "Adresse email"}
              </span>
              <h3
                className="personalInformationDetails"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {CustomerData?.email}
              </h3>
            </div>
          )}
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الولاية" : "Wilaya"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.wilaya}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "البلدية" : "Commune"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.commune}
            </h3>
          </div>
          <div className="flex-col">
            <span
              className="personalInformationSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? "رقم السجل التجاري"
                : "Numéro de registre de commerce"}
            </span>
            <h3
              className="personalInformationDetails"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {CustomerData?.r_commerce}
            </h3>
          </div>
        </div>
      </div>

      {CustomerData?.storeAddresses &&
      CustomerData?.storeAddresses.length > 0 ? (
        <div className="customerClass">
          <h2
            className="customerClassTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "عنوان التسليم الأساسي"
              : "Adresse de livraison principale"}
          </h2>
          <div className="customerPrimaryAddress">
            {CustomerData?.storeAddresses.map((address, index) => (
              <CustomerPrimaryDelivery
                key={index}
                name={address.name}
                primaryDeliveryAddress={address.address}
                language={language}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
