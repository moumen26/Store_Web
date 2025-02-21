import React from "react";

export default function SubscriptionCard({
  title,
  price,
  features,
  buttonText,
  onClick,
}) {
  return (
    <div className="subscriptionCard p-8 rounded-2xl shadow-lg bg-white border border-gray-200 flex flex-col items-center text-center space-y-6 transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-4xl font-extrabold text-blue-500">{price} DA</p>
      <p className="text-gray-600">per month</p>

      <ul className="mt-4 space-y-3 text-gray-700 text-left w-full">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <span className="text-green-500">✔️</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className="mt-6 w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}
