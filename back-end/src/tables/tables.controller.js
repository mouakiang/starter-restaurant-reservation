const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")

async function list(req, res){
    const result = await service.list();
    res.json({result});
}



module.exports = {
    list: asyncErrorBoundary(list),
}