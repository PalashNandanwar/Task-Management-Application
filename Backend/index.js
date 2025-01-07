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

// Define the user schema with isActive field
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isActive: { type: Boolean, default: false }, // Add isActive field
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

// Sign-up Route (for user registration)
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user document
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password, // Storing plain text password
            isActive: true, // Default isActive is false
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Sign-in Route (for user login)
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the plain text password with the one in the database (not hashed)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Set the user as active after successful login
        user.isActive = true;
        await user.save();

        // Generate a JWT token for the authenticated user
        const token = generateAuthToken(user);

        // Send success response with token
        res.status(200).json({
            message: 'User logged in successfully',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout Route (to set isActive to false)
app.post('/api/logout', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Set the user as inactive when logged out
        user.isActive = false;
        await user.save();

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out' });
    }
});

// Example of a protected route that requires authentication
app.get('/api/user', ensureLoggedIn, async (req, res) => {
    res.status(200).json({
        message: 'User authenticated successfully',
        user: req.user,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
