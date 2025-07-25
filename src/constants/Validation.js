export const Validation = {
   
    required: {
        key: 'required',
        message: '^ is required'
    },
    maxlength:{
        key: 'maxlength',
        message: 'Max. length ^ is allowed'
    },
    minlength:{
        key: 'minlength',
        message: 'Min. length ^ is required'
    },
    numeric:{
        key: 'numeric',
        regex: /^[1-9][0-9]*$/,
        message: 'Only (0-9) numbers allowed'
    },
    zeroNumeric:{
        key: 'zeroNumeric',
        regex: /^[0-9]*$/,
        message: 'Only (0-9) numbers allowed'
    },
    decimalPlace:{
        key: 'decimalPlace',
        regex: /^[1-5]*$/,
        message: 'Only numbers(1-5) allowed'
    },
   
   
    email:{
        key: 'email',
        regex: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,15}\b$/i,
        message: 'Enter valid Email-Id'
    },
    ifscCode:{
        key: 'ifscCode',
        regex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        message: 'Enter a valid IFSC Code'
    },
    cardNumber:{
        key: 'cardNumber',
        regex: /^[0-9]{15,16}$/,
        message: 'Enter a valid Card Number'
    },
  
   
    description:{
        key: 'description',
        regex: /^[a-zA-Z0-9`.+,/"-]+([-\s]{1}[a-zA-Z0-9`.+,/"-]+)*$/i,
        message: 'Only (A-Z, a-z, 0-9,`.+,/"-) and space is allowed'
    },
    password:{
        key: 'password',
        regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&-])(?!.*\s)(?!.*[<>]).{8,32}$/,
        message: 'Enter a strong Password (<, > and space not allowed)'
    },
   
    ipAddress:{
        key: 'ipAddress',
        regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        message: 'Enter a valid IP Address'
    },
    mobile:{
        key: 'mobile',
        regex: /^[0-9]*$/,
        message: 'Invalid Mobile Number'
    },
   
    plaintext:{
        key: 'plaintext',
        regex: /^[^<>]{0,}$/,
        message: 'Enter a valid text'
    },
    amount:{
        key: 'amount',
        regex: /^(0*[1-9][0-9]*([\.\][0-9]+)?|0+[\.\][0-9]*[1-9][0-9]*)$/,
        message: 'Enter a valid ^'
    },
    vpa:{
        key: 'vpa',
        regex: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}$/,
        message: 'Enter a valid UPI Id'
    },
    
    
};