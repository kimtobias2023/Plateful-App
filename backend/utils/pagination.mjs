// Apply pagination to an array or list of items
const applyPagination = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems,
      page,
      limit,
      totalItems: items.length,
      totalPages,
    };
  };
  
  // Export the utility function
  module.exports = {
    applyPagination,
  };
  