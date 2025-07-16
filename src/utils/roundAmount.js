export const roundAmount = (amount) => {
  return !isNaN(parseFloat(amount).toFixed(2))
    ? parseFloat(amount).toFixed(2)
    : 0.0;
};
