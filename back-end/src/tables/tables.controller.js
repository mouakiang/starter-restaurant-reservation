const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service");

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

async function create(req, res) {
    const tables = req.body.data;
    const data = await service.create(tables);
    res.status(201).json({data});
  }

async function update(req, res) {
    const {reservation, table} = res.locals;
    const data = await service.update(reservation.reservation_id, table.table_id);
    res.status(200).json({data})
}

async function destroy(req, res) {
  const table = res.locals.table;
  await service.destroy(table.table_id, table.reservation_id);
  const data = await service.list();
  res.json({data});
}

//middleware functions

function hasData(req, res, next) {
    if (req.body.data) {
      return next();
    }
    next({
      status: 400,
      message: "Body must have a data property.",
    })
  }

function tableNameExists(req, res, next) {
    if (req.body.data.table_name) {
      return next();
    }
    next({
      status: 400,
      message: "table_name is required."})
  }

  function tableNameIsOneChar(req, res, next) {
    const tableName = req.body.data.table_name;
    if (tableName.length >= 2 ) {
        return next();
    }
    next({
        status:400, 
        message: "table_name must be longer than 2 character."})
  }

  function capacityExists(req, res, next) {
    if (req.body.data.capacity) {
      return next();
    }
    next({
      status: 400,
      message: "capacity is required."})
  }

  function capacityIsNumber (req, res, next) {
    const { capacity } = req.body.data;
    if (Number.isInteger(capacity)) {
      return next();
    } else {
      return next({
        status: 400,
        message: `capacity field is not formatted correctly. ${capacity} must be a number`
      });
    }
  }
  async function reservationExists (req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await reservationService.read(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} not found.`
    });
  }

  function reservationIdExists(req, res, next) {
    const reservation = req.body.data.reservation_id;
    if (reservation) {
      return next();
    }
    next({
      status: 400,
      message: "reservation_id required",
    })
  }
  

  async function tableExists(req, res, next) {
    const table_id = req.params.table_id;
    const table = await service.read(table_id);
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: `table_id ${table_id} does not exist`,
    })
  }

  async function tableCapacity(req, res, next) {
    if (res.locals.table.reservation_id) {
      return next({
          status: 400,
          message:
              "This table is already occupied. Please choose a different table.",
      });
  }
  
    if (res.locals.table.capacity < res.locals.reservation.people) {
      return next({
        status: 400,
        message: `the table you selected does not have enough capacity to seat ${res.locals.reservation.people} people`,
      });
    }
  
    next();
  }

  function tableNotOpen(req, res, next) {
    const table = res.locals.table;
    if (table.table_status === 'occupied') {
      return next();
    }
    next({
      status: 400,
      message: "table_id is not occupied",
    })
  }

  async function checkReservationStatus(req, res, next) {
    const { reservation } = res.locals;
    if (reservation.status === 'seated') {
      return res.status(400).json({ error: "Reservation is already seated" });
    }
      next();
  }
  


module.exports = {
    list: asyncErrorBoundary(list),
    create: [
    hasData,
    tableNameExists,
    tableNameIsOneChar,
    capacityExists,
    capacityIsNumber,
    asyncErrorBoundary(create)],
    update: [
    asyncErrorBoundary(tableExists),
    hasData,
    reservationIdExists,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableCapacity),
    asyncErrorBoundary(checkReservationStatus),
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    tableNotOpen,
    asyncErrorBoundary(destroy)],
}