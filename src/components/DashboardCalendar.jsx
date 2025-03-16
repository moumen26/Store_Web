import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { locale, addLocale } from "primereact/api";
import "primeicons/primeicons.css";

export default function DashboardCalendar({ onDateChange, language }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = new Date();

  addLocale("fr", {
    firstDayOfWeek: 1,
    dayNames: [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ],
    dayNamesShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Janv",
      "Févr",
      "Mars",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ],
    today: "Aujourd'hui",
    clear: "Effacer",
    dateFormat: "dd-mm-yy",
    weekHeader: "Sem",
  });

  addLocale("ar", {
    firstDayOfWeek: 0,
    dayNames: [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
    dayNamesShort: ["أحد", "إثن", "ثلاث", "أربع", "خميس", "جمع", "سبت"],
    dayNamesMin: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
    monthNames: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
    monthNamesShort: [
      "ينا",
      "فبر",
      "مار",
      "أبر",
      "ماي",
      "يون",
      "يول",
      "أغس",
      "سبت",
      "أكت",
      "نوف",
      "ديس",
    ],
    today: "اليوم",
    clear: "مسح",
    dateFormat: "dd-mm-yy",
    weekHeader: "أسبوع",
  });

  locale(language); // Set the locale based on the selected language

  const handleStartDateChange = (date) => {
    if (date !== startDate) {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(null); // Reset end date if it's before the new start date
      }
      onDateChange(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    if (date !== endDate) {
      setEndDate(date);
      onDateChange(startDate, date);
    }
  };

  return (
    <div className={`dateRangeSelector ${language === "ar" ? "rtl" : ""}`}>
      <div className="flex DateRangeSelector">
        <div className="flex items-center space-x-4 dateRangeSelectorContainer">
          <label
            htmlFor="startDate"
            className={language === "ar" ? "ml-4" : ""}
          >
            {language === "fr" ? "Date de début :" : "تاريخ البدء : "}
          </label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.value)}
            showIcon
            dateFormat="dd-mm-yy"
            className="calendar"
            maxDate={today}
          />
        </div>
        <div className="flex items-center space-x-4 dateRangeSelectorContainer">
          <label htmlFor="endDate" className={language === "ar" ? "ml-4" : ""}>
            {language === "fr" ? "Date de fin :" : " تاريخ الانتهاء :"}
          </label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.value)}
            showIcon
            dateFormat="dd-mm-yy"
            className="calendar"
            disabled={!startDate}
            minDate={startDate}
            maxDate={today}
          />
        </div>
        <button
          className="relative text-gray-700 font-semibold transition-all duration-300 
             after:content-[''] after:absolute after:left-0 after:bottom-[10px] after:w-0 after:h-[1px] after:bg-gray-700 after:transition-all after:duration-300 
             hover:after:w-full"
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            onDateChange(null, null);
          }}
        >
          {language === "fr" ? "Effacer" : "مسح"}
        </button>
      </div>
    </div>
  );
}
