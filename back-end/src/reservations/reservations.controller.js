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

async function update(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const result = await service.updateReservation(updatedRes);
  res.status(200).json({ data: result });
}

  

async function updateStatus(req, res) {
  const status = req.body.data.status;
  const { reservation_id } = res.locals.reservation;
  const result = await service.status(reservation_id, status);
  res.json({ data: result });
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
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have a data property.",
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
  const { reservation_date } = req.body.data;
  if (new Date(reservation_date).getUTCDay() === 2) {
    return next({
      status: 400, 
      message: "Restaurant is closed on Tuesdays."
    });
  }
  next(); 
}

function businessHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const hours = parseInt(time.substring(0, 2));
  const min = parseInt(time.substring(3));

  if ((hours === 10 && min >= 30) || hours > 10) {
    if ((hours === 21 && min <= 30) ||hours < 21) {
      return next();
    }
  }
  return next({
    status: 400,
    message: `Business hours are from 10:30AM to 9:30PM`,
  });
} 

function checkStatus(req, res, next) {
  const { data: { status } = {} } = req.body;
  const reservationStatus = res.locals.reservation.status;
  if (status === 'unknown') {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  if (reservationStatus === 'finished') {
    return next({
      status: 400,
      message: `Invalid status: ${reservationStatus}`,
    });
  }
  next();
}


function validStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== 'seated' && status !== 'finished') {
    return next();
  }
  next({
    status: 400,
    message: `status ${status} is not valid.`,
  })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
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
  validStatus,
  fallsOnTuesday,
  businessHours,
  asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
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
    businessHours,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    checkStatus,
    asyncErrorBoundary(updateStatus),
  ]
};
