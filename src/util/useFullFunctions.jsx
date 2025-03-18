const arabicMonthNames = [
  "جانفي",
  "فيفري",
  "مارس",
  "أفريل",
  "ماي",
  "جوان",
  "جويلية",
  "أوت",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const formatDate = (dateString, language = "fr") => {
  const dateObj = new Date(dateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  let formattedDate = dateObj.toLocaleDateString(
    language === "ar" ? "ar-FR" : "fr-FR",
    options
  );

  if (language === "ar") {
    const monthIndex = dateObj.getMonth();
    const arabicMonthName = arabicMonthNames[monthIndex];
    formattedDate = formattedDate.replace(
      dateObj.toLocaleString("ar-FR", { month: "long" }),
      arabicMonthName
    );
  }

  return formattedDate;
};

const orderStatusTextDisplayer = (status, type, language = "fr") => {
  const translations = {
    fr: {
      "-2": "Commande annulée par le magasin",
      "-1": "Commande annulée par le client",
      "0": "Commande passée",
      "1": "Préparation de votre commande",
      "2": type?.toString() === "pickup" ? "Prêt pour le retrait" : "Commande en route vers l'adresse",
      "3": type?.toString() === "pickup" ? "Retirée" : "Livrée",
      "4": "Commande retournée",
      "10": "Entièrement payée",
      default: "Commande passée",
    },
    ar: {
      "-2": "تم إلغاء الطلب من قبل المتجر",
      "-1": "تم إلغاء الطلب من قبل العميل",
      "0": "تم تقديم الطلب",
      "1": "جارٍ تحضير طلبك",
      "2": type?.toString() === "pickup" ? "جاهز للاستلام" : "الطلب في الطريق إلى العنوان",
      "3": type?.toString() === "pickup" ? "تم الاستلام" : "تم التوصيل",
      "4": "تم إرجاع الطلب",
      "10": "مدفوع بالكامل",
      default: "تم تقديم الطلب",
    },
  };

  return translations[language][status.toString()] || translations[language].default;
};

const formatNumber = (num) => {
  if (num == null) return "0.00";
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export { formatDate, orderStatusTextDisplayer, formatNumber };