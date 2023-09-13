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



module.exports = {
    list: asyncErrorBoundary(list),
    create: [asyncErrorBoundary(create)],
}