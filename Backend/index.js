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

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'], // Status options
            default: 'todo',
        },
        assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        position: { type: Number, default: 0 }, // For moving tasks
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Task creator
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

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

//Task APIs

//create tasks post
app.post('/api/tasks', ensureLoggedIn, async (req, res) => {
    const { title, description, assignedUser, status, position } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            status,
            position,
            assignedUser,
            createdBy: req.user._id, // Task creator
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//Get All Tasks
app.get('/api/tasks', ensureLoggedIn, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id }).populate('assignedUser');
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//Get Task by ID
app.get('/api/tasks/:id', ensureLoggedIn, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            createdBy: req.user._id,
        }).populate('assignedUser');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//Update Task
app.put('/api/tasks/:id', ensureLoggedIn, async (req, res) => {
    const { title, description, assignedUser } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { title, description, assignedUser },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//delete task
app.delete('/api/tasks/:id', ensureLoggedIn, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id,
        });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//Update task status
app.patch('/api/tasks/:id/status', ensureLoggedIn, async (req, res) => {
    const { status } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//move task to another column
app.patch('/api/tasks/:id/move', ensureLoggedIn, async (req, res) => {
    const { position } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { position },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error moving task:', error.message);
        res.status(500).json({ message: 'Server error' });
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
