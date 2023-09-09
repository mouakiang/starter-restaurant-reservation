const knex = require ("../db/connection");
const table = "reservations";

function list() {
    return knex(table)
    .select("*")
    .orderBy("reservation_date")
    .orderBy("reservation_time");
}

function listReservationsByDate(reservation_date) {
    return knex (table)
    .where({reservation_date})
    .whereNot({status: "finished"})
    .andWhereNot({status: "cancelled"})
    .orderBy("reservation_time");
}

function read(reservation_id) {
    return knex(table)
    .select("*")
    .where({reservation_id})
    .first();
}

function create(newReservation) {
    return knex(table)
    .insert({
        ...newReservation,
        "status": "booked",
    })
    .returning("*")
    .then((result) => result[0]);
}


module.exports = {
    list,
    listReservationsByDate,
    read,
    create,
};