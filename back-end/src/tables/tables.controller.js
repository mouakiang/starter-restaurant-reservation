const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")

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
    res.json({data})
}

//middleware functions

function hasData(req, res, next) {
    const data = req.body.data;
    if (data) {
        return next();
    }
    next({
        status: 400, 
        message: "Data property is required."
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


module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData,
    tableNameExists,
    tableNameIsOneChar,
    capacityExists,
    capacityIsNumber,
    asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(update)],
}