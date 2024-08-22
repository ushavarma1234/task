const express = require('express');
const router = express.Router(); // Ensure router is defined
const {
  register,
  login,
  getAllUsers,
  getUserById,
  editUserById // Import the new controller function
} = require('../controllers/authController'); // Ensure correct path to authController

// Define routes
router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', editUserById); // Correct endpoint for partial updates

module.exports = router;
