import React from "react";

export default function CustomerPrimaryDelivery({ 
  primaryDeliveryAddress,
  name,
}) {
  return (
    <div className="customerPrimaryDelivery">
      <h3 className="dashboardCardTitle flex items-center h-[50px]">
        {name}
      </h3>
      <span className="primaryDeliveryAddressSpan">
        {primaryDeliveryAddress}
      </span>
    </div>
  );
}
