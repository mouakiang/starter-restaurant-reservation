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
    })
    .returning("*")
    .then((result) => result[0]);
}

function updateReservation(updatedReservation){
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then((updatedRecords) => updatedRecords[0])
}

function status(reservation_id, status){
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*")
    .then((createdRecords) => createdRecords[0]);
}
module.exports = {
    list,
    reservationsService,
    read,
    create,
    updateReservation,
    status,
};