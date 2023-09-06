/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");

router.route("/")
.get(controller.list)
.all(methodNotAllowed);

router.route("/:reservationId([0-9]+)")
.get(controller.read)
.all(methodNotAllowed);

module.exports = router;
