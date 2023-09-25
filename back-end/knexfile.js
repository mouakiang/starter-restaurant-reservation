/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL="postgres://nfeehymn:ncOYSRPpfKiNV-1LGi5BFfXkG-dv6r06@batyr.db.elephantsql.com/nfeehymn",
  DATABASE_URL_DEVELOPMENT="postgres://ivazguwg:fyOF4yEaxgWirqjo0lFCJGP0oColOMJq@batyr.db.elephantsql.com/ivazguwg",
  DATABASE_URL_TEST="postgres://amuqqask:OqHd5R0j9ze4ouXbRS-smRCCOFlzF9VW@batyr.db.elephantsql.com/amuqqask",
  DATABASE_URL_PREVIEW="postgres://himqkadx:oeHBjJPtTU4L5xCIaVGfStATb9NCo6me@batyr.db.elephantsql.com/himqkadx",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
