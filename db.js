const Database = require("better-sqlite3");

const db = new Database("auth.db");

// create table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

function getUser(username) {
  return db.prepare("SELECT * FROM users WHERE username LIKE ?").get(username)
}

function createUser(username, password) {
  return db
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, password);
}

module.exports = { getUser, createUser };
