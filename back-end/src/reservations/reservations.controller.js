const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")


async function list(request, response) {
  const date = request.query.date;
  const mobile_number = request.query.mobile_number;
  const reservations = await service.list(date, mobile_number);
  const res = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  response.json({ data: res });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({data});
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json({data: newReservation});
}

// middleware functions

async function reservationExists (req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist. `
  });
}

// function hasData(req, res, next) {
//   const data = req.body.data;
//   if (data) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: "Data is missing"
//   })
// }

// function firstNameExists(req, res, next) {
//   const firstName = req.body.data.first_name;
//   if (firstName) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: "First name is required"
//   })
// }

// function lastNameExists(req, res, next) {
//   const lastName = req.body.data.last_name;
//   if (lastName) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: "Last name is required"
//   })
// }

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [asyncErrorBoundary(create)],
};
