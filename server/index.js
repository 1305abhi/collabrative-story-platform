const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests from the client
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Collaborative Story Platform Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
