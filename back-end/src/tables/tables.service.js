const knex = require ("../db/connection");

function create(newTable) {
    return knex("tables")
    .insert({
        ...newTable,
        "table_status": newTable.reservation_id ? "occupied" : 
        "free",
    })
    .returning("*")
    .then((result) => result[0]);
}

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

module.exports = {
    list,
    create,
}