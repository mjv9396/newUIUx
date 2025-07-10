export const validate = (data) => {
  const errors = {};
  
  if (!data.acquirerPgId || data.acquirerPgId.trim() === "") {
    errors.acquirerPgId = "PG ID is required";
  }
  
  if (!data.acquirerPgKey || data.acquirerPgKey.trim() === "") {
    errors.acquirerPgKey = "PG Key is required";
  }
  
  if (!data.acquirerPgPassword || data.acquirerPgPassword.trim() === "") {
    errors.acquirerPgPassword = "PG Password is required";
  }
  
  return errors;
};
