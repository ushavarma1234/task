const mysql = require('mysql2');
const db = require('../config/db');


const createUser = async (userData) => {
  const { fullName, email, phoneNumber, password, gender } = userData;
  try {
    const [result] = await db.query(
      'INSERT INTO users (fullName, email, phoneNumber, password, gender) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, phoneNumber, password, gender]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Function to get all users
const getAllUsers = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    throw error;
  }
};


const getUserById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (id, updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    let query = 'UPDATE users SET ';
    query += fields.map(field => `${field} = ?`).join(', ');
    query += ' WHERE id = ?';

    values.push(id);

    await db.query(query, values);

    const [result] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return result[0];
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUserById
};
