/**
 * Utility functions for File Upload Operations
 */

/**
 * Parses CSV file content to JSON
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('File must contain headers and at least one data row'));
          return;
        }
        
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
          
          if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            data.push(row);
          }
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parses Excel file content to JSON (requires SheetJS library)
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    // Note: This would require installing xlsx library
    // For now, we'll handle it as CSV or suggest using CSV format
    reject(new Error('Excel files not supported yet. Please use CSV format.'));
  });
};

/**
 * Parses JSON file content
 */
export const parseJSONFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonContent = event.target.result;
        const data = JSON.parse(jsonContent);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validates file type and size
 */
export const validateFile = (file, maxSizeMB = 5) => {
  const errors = [];
  
  // Check file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ];
  
  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    errors.push('Only CSV, Excel, and JSON files are allowed');
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File cannot be empty');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validates beneficiary data for business rules
 */
export const validateBeneficiaryData = (data) => {
  const errors = [];
  const duplicateOrderIds = [];
  const orderIdMap = new Map();
  const rowErrors = [];
  
  // Check for duplicate order IDs and field validations
  data.forEach((row, index) => {
    const rowValidationErrors = [];
    
    // Check order ID
    const orderId = row.orderId || row.OrderID || row.order_id;
    if (orderId) {
      if (orderIdMap.has(orderId)) {
        // Mark both the original and current row as duplicates
        const originalIndex = orderIdMap.get(orderId);
        if (!duplicateOrderIds.includes(originalIndex)) {
          duplicateOrderIds.push(originalIndex);
        }
        duplicateOrderIds.push(index);
      } else {
        orderIdMap.set(orderId, index);
      }
    }
    
    // Validate mobile number (10 digits)
    const mobile = row.mobile || row.Mobile || row.phone;
    if (mobile) {
      const cleanMobile = mobile.toString().replace(/\D/g, ''); // Remove non-digits
      if (cleanMobile.length !== 10) {
        rowValidationErrors.push('Mobile must be 10 digits');
      }
    }
    
    // Validate email format
    const email = row.email || row.Email;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.toString().trim())) {
        rowValidationErrors.push('Invalid email format');
      }
    }
    
    // Validate amount (positive float)
    const amount = row.amount || row.Amount;
    if (amount !== undefined && amount !== null && amount !== '') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        rowValidationErrors.push('Amount must be positive number');
      }
    }
    
    if (rowValidationErrors.length > 0) {
      rowErrors.push({
        row: index + 1,
        errors: rowValidationErrors
      });
    }
  });
  
  // Add duplicate order IDs error
  if (duplicateOrderIds.length > 0) {
    errors.push({
      type: 'duplicate_order_ids',
      message: 'Duplicate Order IDs found',
      affectedRows: duplicateOrderIds
    });
  }
  
  // Add field validation errors
  if (rowErrors.length > 0) {
    errors.push({
      type: 'field_validation',
      message: 'Field validation errors',
      rowErrors: rowErrors
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    duplicateOrderIds: duplicateOrderIds,
    fieldErrors: rowErrors
  };
};

/**
 * Main file parser function
 */
export const parseUploadedFile = async (file) => {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    let data;
    switch (fileExtension) {
      case '.csv':
        data = await parseCSVFile(file);
        break;
      case '.json':
        data = await parseJSONFile(file);
        break;
      case '.xlsx':
      case '.xls':
        data = await parseExcelFile(file);
        break;
      default:
        throw new Error('Unsupported file format');
    }
    
    // Validate beneficiary data for business rules
    const beneficiaryValidation = validateBeneficiaryData(data);
    
    return {
      success: true,
      data: data,
      fileName: file.name,
      fileSize: file.size,
      validation: beneficiaryValidation
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fileName: file.name
    };
  }
};
