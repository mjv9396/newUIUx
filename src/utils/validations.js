export const validateEmail = (email) => {
  // Regular Expression for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") return "Email is required";
  else if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.trim() === "") return "Invalid Password character";

  const passwordRules = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRules.test(password)) {
    return "Password must be at least 8 characters long, contain one uppercase letter, and one special character";
  }

  return null;
};

export const validateName = (name) => {
  if (!name || name.trim() === "") return "Name is required";
  // Trim leading and trailing whitespace
  name = name.trim();
  // Regular expression for valid names
  const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
  // Check length
  if (name.length < 2 || name.length > 100) {
    return "Name is too short/long should be from 2 to 100"; // Invalid length
  }
  // Validate against the regex
  if (!nameRegex.test(name)) return "Invalid characters in name";
  return null;
};

export const validateOrderId = (orderId) => {
  if (!orderId || orderId.trim() === "") return "Order ID is required";
  // Regular expression for valid order IDs (alphanumeric, underscores, hyphens)
  const orderIdRegex = /^[a-zA-Z0-9_-]{2,100}$/;  
  // Validate against the regex
  if (!orderIdRegex.test(orderId)) return "Invalid characters in Order ID";
  return null;
};

export const validateGST = (gst) => {
  if (!gst || gst.trim() === "") return "GST Number is required";
  // const gstRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  // if (!gstRegex.test(gst)) return "Invalid GST Number";
  return null;
};

export const validatePAN = (pan) => {
  if (!pan || pan.trim() === "") return "PAN Number is required";
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan)) return "Invalid PAN Number";
  return null;
};

export const validateSSN = (ssn) => {
  if (!ssn || ssn.trim() === "") return "SSN Number is required";
  const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  if (!ssnRegex.test(ssn)) return "Invalid SSN Number";
  return null;
};

// export const validateContact = (number) => {
//   if (!number || number.trim() === "") return "Phone number is required";
//   // Regular expression for validating contact numbers
//   // const phoneRegex =
//   //   /^\+?[1-9]\d{0,2}[ -]?\(?\d{1,4}\)?[ -]?\d{1,4}[ -]?\d{1,4}[ -]?\d{1,9}$/;
//   // const phoneRegex =
//   //   /^\+?[1-9]\d{0,2}[ -]?\(?\d{2,4}\)?[ -]?\d{3,4}[ -]?\d{4,9}$/;
//   const phoneRegex =
//     /^(\+?[1-9]\d{0,2}[ -]?)?(\(?\d{2,4}\)?[ -]?)?\d{3,4}[ -]?\d{3,4}$/;
//   if (!phoneRegex.test(number)) return "Invalid Phone number";
//   return null;
// };
export const validateContact = (number) => {
  if (!number || number.trim() === "") return "Phone number is required";
  
  // Remove any spaces, hyphens, or parentheses for validation
  const cleanNumber = number.replace(/[\s\-\(\)]/g, '');
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return "Phone number should contain only digits";
  }
  
  // Check length for Indian mobile numbers (10 digits)
  if (cleanNumber.length !== 10) {
    return "Phone number must be exactly 10 digits";
  }
  
  // Check if it starts with valid Indian mobile number prefix
  const basicMobileRegex = /^[6-9]\d{9}$/;
  if (!basicMobileRegex.test(cleanNumber)) {
    return "Phone number must start with 6, 7, 8, or 9";
  }
  
  return null;
};
export const validateIntegerNumber = (number) => {
  const integerRegex = /^[0-9]+$/; // Only digits
  if (!integerRegex.test(number)) return "Number should only be integer";
  return null;
};

export const validateDecimalNumber = (input) => {
  const decimalRegex = /^-?\d+(\.\d+)?$/; // Digits with optional decimal and negative sign
  if (!decimalRegex.test(input)) return "Invalid Decimal Format";
  return null;
};

export const validateWebsiteUrl = (url) => {
  if (!url || url.trim() === "") return null;
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  if (!urlRegex.test(url)) return "Invalid Website URL";
  return null;
};
export const validateEmpty = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.length === 0 ||
    data === ""
  )
    return "Field Should not Empty";
  return null;
};
export const validateZipCode = (data) => {
  if (data === null || data === undefined || data.length === 0)
    return "Field Should not Empty";
  const urlRegex = /^[A-Za-z0-9\s-]{3,10}$/;
  if (!urlRegex.test(data)) return "Invalid ZipCode";
  return null;
};
export const validateFile = (file) => {
  if (
    file === null ||
    file === undefined ||
    file.length === 0 ||
    file.type === "application/pdf"
  ) {
    return "Field Should not be Empty and Should be in .jpg/.png/.jpeg";
  }
  // const extentionRegex =
  //   /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)?$/;
  // if (extentionRegex) return "File extension not allowed";
  // console.log("extension", file);
  // if (
  //   file.type === "application/pdf" ||
  //   "application/html" ||
  //   "application/wps" ||
  //   "application/doc" ||
  //   "application/docx" ||
  //   "application/odt" ||
  //   "application/tex" ||
  //   "application/txt" ||
  //   "application/rtf" ||
  //   "application/wks" ||
  //   "application/wpd"
  // ) {
  //   return "File type not supported";
  // }
  return null;
};

export const validateVpa = (input) => {
  if (!input || input.trim() === "") return "VPA is required";
  // Regular expression for validating VPA
  const vpaRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!vpaRegex.test(input)) return "Invalid VPA format";
  return null;
};

export const validateIPAddress = (ip) => {
  if (!ip || ip.trim() === "") return "IP address is required";
  
  // Trim the input
  const trimmedIp = ip.trim();
  
  // Regular expression for IPv4 validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!ipv4Regex.test(trimmedIp)) {
    return "Invalid IP address format. Use format: xxx.xxx.xxx.xxx";
  }
  
  // Additional check: Ensure each octet is valid
  const octets = trimmedIp.split('.');
  for (let octet of octets) {
    const num = parseInt(octet, 10);
    if (num < 0 || num > 255) {
      return "IP address octets must be between 0 and 255";
    }
  }
  
  return null;
};

export const validateURL = (url) => {
  if (!url || url.trim() === "") return "URL is required";
  
  const trimmedUrl = url.trim();
  
  // Comprehensive URL regex that requires protocol
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  
  if (!urlRegex.test(trimmedUrl)) {
    return "Invalid URL format. Must start with http:// or https://";
  }
  
  // Check for potentially malicious patterns
  if (trimmedUrl.includes('<') || trimmedUrl.includes('>') || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return "URL contains invalid characters";
  }
  
  return null;
};

export const validateAccountNumber = (accountNo) => {
  if (!accountNo || accountNo.toString().trim() === "") return "Account number is required";
  
  const accountStr = accountNo.toString().trim();
  
  // Check if it contains only digits
  if (!/^\d+$/.test(accountStr)) {
    return "Account number should contain only digits";
  }
  
  // Check length (Indian bank account numbers are typically 9-18 digits)
  if (accountStr.length < 9 || accountStr.length > 18) {
    return "Account number must be between 9 and 18 digits";
  }
  
  return null;
};

export const validateIFSC = (ifsc) => {
  if (!ifsc || ifsc.trim() === "") return "IFSC code is required";
  
  const trimmedIfsc = ifsc.trim().toUpperCase();
  
  // IFSC format: 4 letters (bank code) + 0 + 6 alphanumeric characters (branch code)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  
  if (!ifscRegex.test(trimmedIfsc)) {
    return "Invalid IFSC code format. Example: SBIN0001234";
  }
  
  return null;
};

export const validateCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.toString().trim() === "") return "Card number is required";
  
  const cardStr = cardNumber.toString().trim().replace(/\s/g, ''); // Remove spaces
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cardStr)) {
    return "Card number should contain only digits";
  }
  
  // Card numbers are typically 13-19 digits
  if (cardStr.length < 13 || cardStr.length > 19) {
    return "Card number must be between 13 and 19 digits";
  }
  
  return null;
};

export const validateAmount = (amount, min = 1, max = 10000000) => {
  if (!amount || amount.toString().trim() === "") return "Amount is required";
  
  const amountStr = amount.toString().trim();
  
  // Check if it's a valid number format
  const decimalRegex = /^\d+(\.\d{1,2})?$/;
  if (!decimalRegex.test(amountStr)) {
    return "Invalid amount format. Use up to 2 decimal places";
  }
  
  const numAmount = parseFloat(amountStr);
  
  // Check if amount is positive
  if (numAmount <= 0) {
    return "Amount must be greater than 0";
  }
  
  // Check minimum amount
  if (numAmount < min) {
    return `Amount must be at least ₹${min}`;
  }
  
  // Check maximum amount
  if (numAmount > max) {
    return `Amount cannot exceed ₹${max.toLocaleString('en-IN')}`;
  }
  
  return null;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove potentially dangerous characters for XSS prevention
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=
  
  return sanitized;
};
