/**
 * Paginates an array of results.
 * @param {Array} results - Array of items to paginate
 * @param {number} page - Current page number
 * @param {number} pageSize - Number of items per page
 * @returns {Object}
 */
const paginateResults = (results, page, pageSize) => {
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const paginatedResults = results.slice((page - 1) * pageSize, page * pageSize);
  
    return generateResponse(paginatedResults, totalItems, page, pageSize);
  };
  
  /**
   * Generates a structured response for pagination.
   * @param {Array} data - Paginated items
   * @param {number} totalItems - Total count of items
   * @param {number} page - Current page
   * @param {number} pageSize - Items per page
   * @returns {Object}
   */
  const generateResponse = (data, totalItems, page, pageSize) => ({
    data,
    meta: {
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      hasNextPage: page < Math.ceil(totalItems / pageSize),
      hasPrevPage: page > 1,
    },
  });
  
  module.exports = { paginateResults };
  