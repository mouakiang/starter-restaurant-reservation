const knex = require ("../db/connection");

function list(table_name) {
    return knex("tables")
    .select()
    .orderBy(table_name)
    .first();
}

module.exports = {
    list,
}