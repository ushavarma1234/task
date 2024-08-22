// services/userService.js

import { query } from './db'; // Replace with your actual database connection module

// Fetch all users
const getAllUsers = async () => {
  try {
    const result = await query('SELECT * FROM users'); // Adjust query to your database schema
    return result.rows; 
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export default {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
};
