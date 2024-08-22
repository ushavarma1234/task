const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



router.put('/usersedit/:id', editUserById); 
// Registration endpoint
const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.createUser({ fullName, email, phoneNumber, password: hashedPassword, gender });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with all user details
    res.json({ 
      token, 
      fullName: user.fullName, 
      email: user.email, 
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      createdAt: user.createdAt // or any other fields you want to include
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Get all users endpoint
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get user by ID endpoint
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// controllers/authController.js

const { updateUserById } = require('../models/User');

// Edit user by ID
const editUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('Received updates:', updates); // Debugging line

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Update user
    const updatedUser = await updateUserById(id, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Edit user by ID error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  editUserById
};