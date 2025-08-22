/**
 * Utility functions for Bulk Payout Template Operations
 */

// Template data structure
export const TEMPLATE_COLUMNS = [
  'orderId',
  'mobile',
  'amount',
  'accountNo',
  'name',
  'nickName',
  'ifsc',
  'email'
];

// Sample template data
export const SAMPLE_DATA = [
  {
    orderId: "17520311105",
    mobile: "9876543238",
    amount: 10.00,
    accountNo: "9922000100018651",
    name: "Shashidhar",
    nickName: "Shashi",
    ifsc: "PUNB0992200",
    email: "shashi15@gmail.com"
  },
  {
    orderId: "17520311106",
    mobile: "9876543239",
    amount: 25.50,
    accountNo: "9922000100018652",
    name: "Rajesh Kumar",
    nickName: "Rajesh",
    ifsc: "PUNB0992201",
    email: "rajesh.kumar@gmail.com"
  }
];

/**
 * Downloads Excel template for bulk payout
 */
export const downloadTemplate = () => {
  try {
    // Create CSV content
    const headers = TEMPLATE_COLUMNS.join(',');
    const sampleRows = SAMPLE_DATA.map(row => 
      TEMPLATE_COLUMNS.map(col => {
        const value = row[col];
        // Wrap in quotes if value contains comma or is string
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${sampleRows}`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bulk_payout_template_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return { success: true, message: 'Template downloaded successfully' };
  } catch (error) {
    console.error('Error downloading template:', error);
    return { success: false, message: 'Failed to download template' };
  }
};

/**
 * Downloads JSON template for bulk payout
 */
export const downloadJSONTemplate = () => {
  try {
    const jsonContent = JSON.stringify(SAMPLE_DATA, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bulk_payout_template_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return { success: true, message: 'JSON template downloaded successfully' };
  } catch (error) {
    console.error('Error downloading JSON template:', error);
    return { success: false, message: 'Failed to download JSON template' };
  }
};

/**
 * Validates beneficiary data structure
 */
export const validateBeneficiaryData = (data) => {
  const errors = [];
  
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data must be an array'] };
  }
  
  data.forEach((item, index) => {
    const rowErrors = [];
    
    // Required field validation
    TEMPLATE_COLUMNS.forEach(column => {
      if (!item[column] || item[column].toString().trim() === '') {
        rowErrors.push(`${column} is required`);
      }
    });
    
    // Specific validations
    if (item.mobile && !/^\d{10}$/.test(item.mobile.toString())) {
      rowErrors.push('Mobile number must be 10 digits');
    }
    
    if (item.amount && (isNaN(item.amount) || parseFloat(item.amount) <= 0)) {
      rowErrors.push('Amount must be a positive number');
    }
    
    if (item.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
      rowErrors.push('Invalid email format');
    }
    
    if (item.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(item.ifsc)) {
      rowErrors.push('Invalid IFSC code format');
    }
    
    if (rowErrors.length > 0) {
      errors.push({
        row: index + 1,
        errors: rowErrors
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
