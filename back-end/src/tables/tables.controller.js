const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")

async function create(req, res) {
    const tables = req.body.data;
    const data = await service.create(tables);
    res.status(201).json({data});
  }

async function list(req, res){
    const result = await service.list();
    res.json({result});
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
        message: "table_name must be longer than 2 characters."})
  }


module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData,
    tableNameExists,
    tableNameIsOneChar,
    asyncErrorBoundary(create)],
}