/**
 * List handler for reservation resources
 */
const reservationService = require("./reservations.service")


function list(req, res, next) {
  res.json({data: res.locals.reservations});
};

async function listReservationsByDate(req, res) {
  try {
    //Default to today's date if no parameter is provided
    const date = req.query.date || new Date().toISOString().split("T")[0];

    //Fetch reservations for the specified date from the service
    const reservations = await reservationService.fetchReservationsByDate(date);

    //Render the dashboard page with reservations data
    res.render("dashboard", {reservations, date});
  } catch (error) {
    res.status(500).json({error: "Unable to fetch reservations."});
  }
}

module.exports = {
  list: [listReservationsByDate, list],
};
