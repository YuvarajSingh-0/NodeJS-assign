const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js and MongoDB social media API');
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
