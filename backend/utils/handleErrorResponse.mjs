// Handle errors and generate consistent error responses
const handleErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
  };
  
  // Handle asynchronous functions and catch any errors
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  // Export the utility functions
  module.exports = {
    handleErrorResponse,
    asyncHandler,
  };
  