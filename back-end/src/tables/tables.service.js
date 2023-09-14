const knex = require ("../db/connection");

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

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

async function update(reservation_id, table_id) {
    const transaction = await knex.transaction();
    return transaction("tables")
        .where({table_id})
        .update({
            reservation_id: reservation_id,
            table_status: "occupied",
        }, "*")
        .then(() =>
            transaction("reservations")
            .where({reservation_id})
            .update({status: "seated"})
        )
        .then(transaction.commit)
        .catch(transaction.rollback);
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({table_id: table_id})
        .first();
}

module.exports = {
    list,
    create,
    update,
    read,
}