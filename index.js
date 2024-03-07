const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Assuming your routes are in a file named userRoutes.js
const connectDB = require('./db');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
