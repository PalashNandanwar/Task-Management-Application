/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(bodyParser.json());
app.use(cors());

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Atlas connection established successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

connectDB();

// Generate JWT token
const generateAuthToken = (user) => {
    const payload = { userId: user._id, username: user.username };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to ensure the user is logged in
const ensureLoggedIn = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in ensureLoggedIn middleware:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Routes
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstName, lastName, username, email, password });
        await newUser.save();
        const token = generateAuthToken(newUser);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateAuthToken(user);
        const { password: userPassword, ...userData } = user.toObject();
        res.status(200).json({ message: 'Login successful', user: userData, token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// app.get('/api/tasks', ensureLoggedIn, async (req, res) => {
//     try {
//         // Example: Fetch tasks for the logged-in user
//         const tasks = []; // Replace with your database query for tasks
//         res.status(200).json({ tasks });
//     } catch (error) {
//         console.error('Error fetching tasks:', error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
