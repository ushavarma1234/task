// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Example profile handler function
const profile = (req, res) => {
  const userId = req.user.id; // Use user ID from authenticated request
  req.db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('User Not Found');
    }

    res.json(results[0]);
  });
};

router.get('/profile', profile);

module.exports = router;
