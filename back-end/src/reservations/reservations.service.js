const knex = require ("../db/connection");

function list(date, mobile_number) {
    if (date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
    }
    if (mobile_number) {
    return knex("reservations")
    .select("*")
    .where("mobile_number", "like", `${mobile_number}%`);
    }
    return knex("reservations")
    .select("*");
    }

function reservationsService(reservation_date) {
    return knex ("reservations")
    .where({reservation_date})
    .whereNot({status: "finished"})
    .andWhereNot({status: "cancelled"})
    .orderBy("reservation_time");
    
}

function read (reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
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
    reservationsService,
    read,
    create,
};