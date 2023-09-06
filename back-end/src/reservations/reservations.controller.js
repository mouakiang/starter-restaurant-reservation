/**
 * List handler for reservation resources
 */
const reservationService = require("./reservations.service")

function list(req, res, next) {
  res.json({data: res.locals.reservations});
};

module.exports = {
  list,
};
