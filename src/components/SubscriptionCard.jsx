import React from "react";

// Icons components for feature categories
const CustomerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);

const VendorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
    <path
      fillRule="evenodd"
      d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
      clipRule="evenodd"
    />
  </svg>
);

const SupplierIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
    <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
    <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
  </svg>
);

const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
    <path
      fillRule="evenodd"
      d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const PublicityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
      clipRule="evenodd"
    />
  </svg>
);

const StockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 01.381.651v5.625a2.25 2.25 0 01-1.138 1.95l-8.25 4.5a.75.75 0 01-.724 0l-8.25-4.5a2.25 2.25 0 01-1.138-1.95v-5.625a.75.75 0 01.382-.651l1.368-.738z" />
  </svg>
);

// Function to render the CRUD labels based on language
const getCrudLabels = (language) => {
  if (language === "ar") {
    return {
      create: "إنشاء",
      read: "قراءة",
      update: "تحديث",
      delete: "حذف",
    };
  }
  return {
    create: "Créer",
    read: "Lire",
    update: "Modifier",
    delete: "Supprimer",
  };
};

export default function SubscriptionCard({
  title,
  price,
  features = {},
  buttonText,
  onClick,
  language = "fr",
  popular = false,
}) {
  // Get CRUD labels for the current language
  const crudLabels = getCrudLabels(language);

  // Define feature icons map
  const featureIcons = {
    customers: <CustomerIcon />,
    vendors: <VendorIcon />,
    suppliers: <SupplierIcon />,
    products: <ProductIcon />,
    publicity: <PublicityIcon />,
    stock: <StockIcon />,
  };

  // Define feature translations
  const featureLabels =
    language === "ar"
      ? {
          customers: "العملاء",
          vendors: "البائعون",
          suppliers: "الموردون",
          products: "المنتجات",
          publicity: "الإعلانات",
          stock: "المخزون",
        }
      : {
          customers: "Clients",
          vendors: "Vendeurs",
          suppliers: "Fournisseurs",
          products: "Produits",
          publicity: "Publicités",
          stock: "Stock",
        };

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
        popular
          ? "ring-2 ring--[#3e9cb9] shadow-lg"
          : "border border-gray-200 shadow"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {popular && (
        <div className="absolute top-0 right-0 -mr-14 -mt-4 w-40 transform rotate-45 bg-[#3e9cb9] text-center py-1 text-white text-xs font-semibold shadow-md">
          {language === "ar" ? "الأكثر شيوعًا" : "Populaire"}
        </div>
      )}

      <div className="p-6 bg-white">
        <div className={`text-center ${language === "ar" ? "mb-8" : "mb-6"}`}>
          <h3
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: language === "ar" ? "Cairo, sans-serif" : "" }}
          >
            {title}
          </h3>

          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-4xl font-extrabold text-[#3e9cb9]">
              {price}
            </span>
            <span className="ms-1 text-xl text-gray-500">
              {language === "ar" ? "دج" : "DA"}
            </span>
          </div>

          <p
            className="mt-1 text-sm text-gray-500"
            style={{ fontFamily: language === "ar" ? "Cairo, sans-serif" : "" }}
          >
            {language === "ar" ? "شهرياً" : "par mois"}
          </p>
        </div>

        <div className="pt-6">
          <h4
            className="text-sm font-semibold text-gray-900 mb-4"
            style={{ fontFamily: language === "ar" ? "Cairo, sans-serif" : "" }}
          >
            {language === "ar"
              ? "الميزات المتضمنة:"
              : "Fonctionnalités incluses:"}
          </h4>

          <div className="space-y-5">
            {Object.entries(features).map(([key, permissions]) => (
              <div
                key={key}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div
                  className={`flex items-center ${
                    language === "ar" ? "space-x-reverse" : ""
                  } space-x-2 mb-3`}
                >
                  <div className="text-[#3e9cb9]">{featureIcons[key]}</div>
                  <h5
                    className="font-medium text-gray-900"
                    style={{
                      fontFamily: language === "ar" ? "Cairo, sans-serif" : "",
                    }}
                  >
                    {featureLabels[key]}
                  </h5>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(permissions).map(
                    ([permission, isAllowed]) => (
                      <div
                        key={permission}
                        className={`flex items-center ${
                          language === "ar" ? "space-x-reverse" : ""
                        } space-x-1`}
                      >
                        <div
                          className={
                            isAllowed ? "text-green-500" : "text-red-500"
                          }
                        >
                          {isAllowed ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily:
                              language === "ar" ? "Cairo, sans-serif" : "",
                          }}
                        >
                          {crudLabels[permission]}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button
          className={`w-full py-3 px-4 ${
            popular
              ? "bg-[#e7f2f7] hover:bg-[#3e9cb9]"
              : "bg-gray-800 hover:bg-black"
          } text-white rounded-lg transition-colors font-medium text-sm shadow-sm hover:shadow`}
          onClick={onClick}
          style={{ fontFamily: language === "ar" ? "Cairo, sans-serif" : "" }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
