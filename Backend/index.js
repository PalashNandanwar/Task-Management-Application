/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // Importing jsonwebtoken
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(bodyParser.json());
app.use(cors());

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });

        console.log('MongoDB Atlas connection established successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1); // Exit process if connection fails
    }
};

// Connect to MongoDB Atlas
connectDB();

// Generate JWT token function
const generateAuthToken = (user) => {
    const payload = {
        userId: user._id,
        username: user.username,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Define the signup route
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        // Check if the user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Save data to the database without hashing the password
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,  // Save password in plain text
        });

        // Save the user in the database
        await newUser.save();

        // Generate JWT token for the new user
        const token = generateAuthToken(newUser);

        // Return success response with the token
        return res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        console.error('Error during registration:', error.message);
        // Return a more specific error message based on the type of error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate email address, user already exists' });
        } else {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }
    }
});

// Define the login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the provided password directly with the stored plain text password
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for the user
        const token = generateAuthToken(user);

        // Exclude the password from the user data returned to the client
        const { password: userPassword, ...userData } = user.toObject();
        return res.status(200).json({ message: 'Login successful', user: userData, token });

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Middleware to protect routes that require authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1] || req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Example of a protected route
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');  // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user profile:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
