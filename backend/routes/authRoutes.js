const express = require('express');
const router = express.Router(); 
const {
  register,
  login,
  getAllUsers,
  getUserById,
  editUserById 
} = require('../controllers/authController'); 


router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', editUserById); 

module.exports = router;
