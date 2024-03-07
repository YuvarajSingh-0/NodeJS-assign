const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();

// Demo Route
router.get('/', (req, res) => {
    res.send('Demo route');
});

// User Registration
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send({ message: 'Invalid username or password' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid username or password' });
    const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY); // Replace 'secret_key' with your secret key
    res.send({ message: 'Logged in successfully', token });
});

// Forgot Password - This is a simple implementation. In a real-world application, you would want to send a password reset link to the user's email.
router.post('/forgot-password', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send({ message: 'Invalid username' });

    // Generate a password reset token
    const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: '30m' }); // Replace 'secret_key' with your secret key

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "help@company.com", 
            pass: process.env.PASSWORD,
        },
    });

    // Send an email with the password reset link
    let info = await transporter.sendMail({
        from: 'help@company.com', // replace with your email
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:3000/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });
    console.log(info)

    res.send({ message: 'Password reset link sent to your email' });
});

// Reset Password
router.post('/forgot-password/:token', async (req, res) => {
    const { newPassword } = req.body;
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace 'secret_key
    if (!decoded) return res.status(400).send({ message: 'Invalid or expired token' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ username: decoded.username }, { password: hashedPassword });
    res.send({ message: 'Password reset successful' });
});

module.exports = router;
