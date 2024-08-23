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


app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
