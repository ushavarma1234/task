const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getAllUsers, getUserById } = require('./services/userService'); // Adjust path as needed
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Secret key for JWT
const JWT_SECRET_KEY = '38336d836e2dc1efc8c01b8095d2278b24b23b595eba229a0089ed230e32265a37e81f125d97bb40dcf6c249fd160a418a596d84cdc126177aef3810ac43d999';

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register user
// Register user
app.post('/api/register', async (req, res) => {
  const { fullName, email, phoneNumber, password, gender } = req.body;
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const userId = await createUser({ fullName, email, phoneNumber, password: hashedPassword, gender });

    // Generate a JWT token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send the response with userId and token
    res.status(201).json({ userId, token });
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

    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, fullName: user.fullName }); // Include user's full name in the response
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Route to get user profile by ID
app.get('/api/user/profile/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Route to update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { name, email, companyName } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      // Update user logic here
      res.json({ name, email, companyName });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



const express = require('express');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());

// Use user routes
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
