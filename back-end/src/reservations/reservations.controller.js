/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")


async function list(req, res) {
  const { date, currentDate } = req.query;
  if (date) {
    const data = await service.listReservationsByDate(date);
    res.json({data});
  } else if (currentDate) {
    const data = await service.listReservationsByDate(date);
    res.json({data});
  } else {
    const data = await service.list();
    res.json({data});
  }
};



function read(req, res) {
  const data = res.locals.reservation;
  res.json({data});
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary, read]
};
