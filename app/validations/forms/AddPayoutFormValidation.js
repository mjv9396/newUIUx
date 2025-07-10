export const validate = (data) => {
  const errors = {};
  
  if (!data.acquirerPayoutPgId || data.acquirerPayoutPgId.trim() === "") {
    errors.acquirerPayoutPgId = "Payout PG ID is required";
  }
  
  if (!data.acquirerPayoutPgKey || data.acquirerPayoutPgKey.trim() === "") {
    errors.acquirerPayoutPgKey = "Payout PG Key is required";
  }
  
  if (!data.acquirerPayoutPgPassword || data.acquirerPayoutPgPassword.trim() === "") {
    errors.acquirerPayoutPgPassword = "Payout PG Password is required";
  }
  
  return errors;
};
