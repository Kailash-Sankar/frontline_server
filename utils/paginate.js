const { formatQueryLimit } = require("./helper");

// Handle Model pagination
async function paginateRecords(Model, query, limit, page) {
  limit = formatQueryLimit(limit);
  page = page || 1;
  return await Model.paginate(query, {
    page,
    limit,
    sort: { updatedAt: -1 },
  });
}

module.exports = {paginateRecords};
