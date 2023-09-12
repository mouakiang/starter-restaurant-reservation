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
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).json({data});
}

async function update(req, res, next) {

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

function hasData(req, res, next) {
  const data = req.body.data;
  if (data) {
    return next();
  }
  next({
    status: 400,
    message: "Data is missing"
  })
}

function firstNameExists(req, res, next) {
  if (req.body.data.first_name) {
    return next();
  }
  next({ status: 400, message: "first_name is required." });
}

function lastNameExists(req, res, next) {
  if (req.body.data.last_name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name is required."})
}

function mobilePhoneExists(req, res, next) {
  if (req.body.data.mobile_number) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number is required."})
}

function reservationDateExists(req, res, next) {
  if (req.body.data.reservation_date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date is required."})
}

function dateIsValid(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid."})
}

function reservationTimeExists(req, res, next) {
  if (req.body.data.reservation_time) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time is required."})
  }

  function validTime(req, res, next) {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    const time = req.body.data.reservation_time;
    const valid = time.match(regex);
    if (valid) {
      return next();
    }
    next({
      status: 400,
      message: "reservation_time must be valid time.",
    })
  }


function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  
  if (people > 0 && typeof people === 'number') {
    return next();
  }
  next({
    status: 400,
    message: "valid people property required"
  })
}

function checkReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
    const parsedReservationDate = new Date(reservation_date);

  if (parsedReservationDate < new Date()) {
    return res.status(400).json({ error: 'Reservation date must be in the future' });
  }
    next();
}

function fallsOnTuesday(req, res, next) {
  const {reservation_date} = req.body.data;
  if(new Date(reservation_date).getDay() === 2) {
    next();
  }
  next({
    status: 400, 
    message: "Restaurant is closed on Tuesdays."
  })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasData,
  firstNameExists,
  lastNameExists,
  mobilePhoneExists,
  reservationDateExists,
  dateIsValid,
  reservationTimeExists,
  validTime,
  hasValidPeople,
  checkReservationDate,
  fallsOnTuesday,
  asyncErrorBoundary(create),
  ],
};
