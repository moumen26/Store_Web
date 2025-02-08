import moment from 'moment';

const formatDate = (dateString) => {
  moment.locale('fr'); // Set locale to French for month names
  return moment.utc(dateString).format('D MMMM YYYY [at] HH:mm:ss');
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
        return type?.toString() == 'pickup' ? "Ready for Pickup" : "Order on the way to address";
      case "3":
        return type?.toString() == 'pickup' ? "Picked up" : "Delivered";
      case "10":
        return "Fully paid";
      default:
        return "Order Placed";
    }
};

export { 
    formatDate,
    orderStatusTextDisplayer
 };