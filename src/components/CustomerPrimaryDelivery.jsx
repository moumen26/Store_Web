import React from "react";

export default function CustomerPrimaryDelivery({ primaryDeliveryAddress }) {
  return (
    <div className="customerPrimaryDelivery">
      <h3 className="dashboardCardTitle flex items-center h-[50px]">
        Billing Address
      </h3>
      <span className="primaryDeliveryAddressSpan">
        {primaryDeliveryAddress}
      </span>
    </div>
  );
}
