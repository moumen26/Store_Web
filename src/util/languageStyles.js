export const getLanguageStyles = (language) => ({
  direction: language === "ar" ? "rtl" : "ltr",
  fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "inherit",
});
