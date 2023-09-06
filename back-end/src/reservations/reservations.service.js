const knex = require ("../db/connection");

function list() {
    return knex("reservations").select("*");

}

function fetchReservationsByDate(date) {
    return knex("reservations")
    .select("*")
    .where("reservation_date", date)
    .orderBy("reservation_time");
}

module.exports = {
    fetchReservationsByDate,
    list,
};