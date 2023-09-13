const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");

router
    .route("/")
    .get(controller.list)
    .all(methodNotAllowed);



module.exports = router;