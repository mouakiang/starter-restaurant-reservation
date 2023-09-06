const knex = require ("../db/connection");

function list() {
    return knex("reservations")
    .select("*")
    .whereNot({status: "finished"})
    .andWhereNot({status: "cancelled"})
    .orderBy("reservation_time");
}

function listReservationsByDate(reservation_date) {
    return knex ("reservations")
    .select("*")
    .where({reservation_date})
    .whereNot({status: "finished"})
    .andWhereNot({status: "cancelled"})
    .orderBy("reservation_time");
}

function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .then((result) => result[0]);
}

function create(newReservation) {
    return knex("reservations")
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