// This file contains validation functions used for form validations

export const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    // Add your password validation logic here
    // Example: password should have at least 8 characters and contain a mix of letters and numbers
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  };
  
  // Add more validation functions as needed
  