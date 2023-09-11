const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")


async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await service.listReservationsByDate({date});
    res.status(200).json({data: date});
  } else {
    const data = await service.list();
    res.status(200).json({data});
  }
};

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({data});
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json({data: newReservation});
}

// //middleware functions

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
  read: [asyncErrorBoundary, read],
  create: [asyncErrorBoundary(create)],
};
