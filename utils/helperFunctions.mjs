// This file contains helper functions used throughout the application

export const capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };
  
  // Add more helper functions as needed
  