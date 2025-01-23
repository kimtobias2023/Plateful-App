// Convert a string to title case (capitalize the first letter of each word)
const toTitleCase = (str) => {
    if (typeof str !== 'string') {
      return '';
    }
    
    return str.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());
  };
  
  // Format a number to have a specific number of decimal places
  const formatNumber = (number, decimalPlaces = 2) => {
    if (typeof number !== 'number') {
      return '';
    }
    
    return number.toFixed(decimalPlaces);
  };
  
  // Export the utility functions
  export {
    toTitleCase,
    formatNumber
  };
  