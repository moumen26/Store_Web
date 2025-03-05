import moment from "moment";

const formatDate = (dateString) => {
  const isoDateString = new Date(dateString).toISOString();

  moment.locale("fr");

  return moment.utc(isoDateString).format("D MMMM YYYY [à] HH:mm:ss");
};
const orderStatusTextDisplayer = (status, type) => {
  switch (status.toString()) {
    case "-1":
      return "till he sell everything";
    case "0":
      return "Order Placed";
    case "1":
      return "Preparing your order";
    case "2":
      return type?.toString() == "pickup"
        ? "Ready for Pickup"
        : "Order on the way to address";
    case "3":
      return type?.toString() == "pickup" ? "Picked up" : "Delivered";
    case "4":
      return "Order returned";
    case "10":
      return "Fully paid";
    default:
      return "Order Placed";
  }
};

const formatNumber = (num) => {
  if (num == null) return "0.00"; // Handle undefined/null values
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export { formatDate, orderStatusTextDisplayer, formatNumber };
