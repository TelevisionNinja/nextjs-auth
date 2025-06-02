import 'server-only'

import { DatabaseSync } from 'node:sqlite';
import crypto from "node:crypto"

const sessionDB = new DatabaseSync(':memory:');

sessionDB.exec(`
  CREATE TABLE IF NOT EXISTS sessions(
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    email TEXT
  ) STRICT
`);

export function createSession(email) {
  const statement = sessionDB.prepare('INSERT INTO sessions (id, timestamp, email) VALUES (?, ?, ?)');
  const sessionID = crypto.randomBytes(512).toString("hex").normalize();
  const timestamp = new Date().toISOString();
  statement.run(sessionID, timestamp, email);

  return sessionID;
}

export function deleteSession(id) {
  const statement = sessionDB.prepare('DELETE FROM sessions WHERE id = ?');
  statement.run(id);
}

export function extendSession(id) {
  const timeNow = new Date();
  const updateStatement = sessionDB.prepare('UPDATE sessions SET timestamp = ? WHERE id = ?');
  updateStatement.run(timeNow.toISOString(), id);
}

export function updateSession(id, expirationLength = 30 * 60 * 1000) {
  const result = getSession(id);

  if (!result) {
    return null;
  }

  const timestamp = new Date(result.timestamp).getTime();
  const timeDiff = Date.now() - timestamp;

  // expired
  if (timeDiff > expirationLength) {
    deleteSession(result.id);
    return null;
  }

  // session is valid, update timestamp to extend expiration
  extendSession(result.id);

  return result;
}

export function getSession(id) {
  const statement = sessionDB.prepare('SELECT * FROM sessions WHERE id = ?');
  return statement.get(id);
}

const database = new DatabaseSync('/database.sqlite');

database.exec(`
  CREATE TABLE IF NOT EXISTS users(
    email TEXT PRIMARY KEY,
    hash TEXT,
    salt TEXT,
    role TEXT
  ) STRICT
`);

export function createUser(email, hash, salt, role = "user") {
  const statement = database.prepare('INSERT INTO users (email, hash, salt, role) VALUES (?, ?, ?, ?)');
  statement.run(email, hash, salt, role);
}

export function getUser(email) {
  const statement = database.prepare('SELECT * FROM users WHERE email = ?');
  return statement.get(email);
}

export function deleteUser(email) {
  const statement = database.prepare('DELETE FROM users WHERE email = ?');
  statement.run(email);
}

export function updatePassword(email, oldHash, newHash, newSalt) {
  const updateStatement = db.prepare(`
    UPDATE users
    SET hash = ?, salt = ?
    WHERE email = ? AND hash = ?
  `);
  updateStatement.run(newHash, newSalt, email, oldHash);
}

export function updateEmail(oldEmail, oldHash, newEmail, newHash) {
  const updateStatement = db.prepare(`
    UPDATE users
    SET email = ?, hash = ?
    WHERE email = ? AND hash = ?
  `);
  updateStatement.run(newEmail, newHash, oldEmail, oldHash);
}

export function updateRole(email, role) {
  const updateStatement = db.prepare(`
    UPDATE users
    SET role = ?
    WHERE email = ?
  `);
  updateStatement.run(role, email);
}
