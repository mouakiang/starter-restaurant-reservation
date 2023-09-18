const knex = require ("../db/connection");

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

function create(newTable) {
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((result) => result[0]);
}

async function update(reservation_id, table_id) {
  return knex.transaction(trx => {
    return knex("tables")
    .where({ table_id })
    .update(
      {
        reservation_id: reservation_id,
        table_status: 'occupied',
      },
      '*')
      .then(() => {
        return knex("reservations")
        .where({reservation_id})
        .update({status: "seated"})
        .returning("*")
      })
    
    .then(trx.commit)
    .catch(trx.rollback)
  });
  }

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({table_id: table_id})
        .first();
}


async function destroy(table_id, reservation_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update({
      reservation_id: null,
      table_status: "free",
    }, "*")
    .then(() => 
      trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" }, "*")
    )
    .then(trx.commit)
    .catch(trx.rollback)
}

module.exports = {
    list,
    create,
    update,
    read,
    destroy
  }