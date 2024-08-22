const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./services/userService').default; // Adjust path as needed
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Middleware for authentication
// Define the authenticateToken middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, '38336d836e2dc1efc8c01b8095d2278b24b23b595eba229a0089ed230e32265a37e81f125d97bb40dcf6c249fd160a418a596d84cdc126177aef3810ac43d999', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register user
app.post('/api/register', async (req, res) => {
  const { fullName, email, phoneNumber, password, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ fullName, email, phoneNumber, password: hashedPassword, gender });
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.' });
  }
});


// Login user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await getUserByEmail(email);
      if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid email or password.' });
  
      const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.json({ token, fullName: user.fullName }); // Include user's full name in the response
    } catch (error) {
      res.status(500).json({ message: 'Error logging in.' });
    }
  });
  

app.get('/api/user/profile/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  console.log(`Received request for user ID: ${userId}`); // Debug log
  
  try {
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in /api/user/profile/:id route:', error.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});


  // Route to update user profile
  app.put('/api/user/profile', authenticateJWT, (req, res) => {
    const { name, email, companyName } = req.body;
    if (users[req.user.email]) {
      users[req.user.email] = { name, email, companyName };
      res.json(users[req.user.email]);
    } else {
      res.sendStatus(404);
    }
  });



// Route to get all users
// Route to get all users without authentication for testing
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in /api/users route:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});








app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



