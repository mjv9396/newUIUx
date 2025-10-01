export const formatToINRCurrency = (amount = 0) => {
  // Safely handle null, undefined, and NaN values
  const safeAmount = (amount === null || amount === undefined || isNaN(amount)) ? 0 : Number(amount);
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
};
