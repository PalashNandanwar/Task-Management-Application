/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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
    isActive: { type: Boolean, default: false },
}, { timestamps: true });


// Define the Team Schema 
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    members: [
        {
            firstName: {
                type: String,
                required: true,
                trim: true,
            },
            lastName: {
                type: String,
                required: true,
                trim: true,
            },
            username: {
                type: String,
                required: true,
                unique: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                trim: true,
            },
            isActive: {
                type: Boolean,
                default: false,
            },
            role: {
                type: String,
                enum: ["Admin", "Member"],
                default: "Member",
            },
        },
    ],
}, { timestamps: true });

// Define the Task Schema 
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
const Team = mongoose.model('Team', TeamSchema);

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

// Get user by Email Id
app.get('/user', async (req, res) => {
    const email = req.query.email; // Email provided as query parameter
    if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
    }

    try {
        const user = await User.findOne({ email }); // Fetch user by email
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user); // Respond with user data
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

        res.status(200).json({
            message: 'User logged in successfully',
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

// Team API's

// Create Team
app.post("/api/teams", async (req, res) => {
    const { name, description, members } = req.body;

    if (!name || !Array.isArray(members)) {
        return res.status(400).json({ error: "Name and members array are required." });
    }

    for (const member of members) {
        if (!member.firstName || !member.lastName || !member.username || !member.email) {
            return res.status(400).json({ error: "Each member must have first name, last name, username, and email." });
        }
    }

    try {
        const newTeam = new Team({
            name,
            description,
            members,
        });

        const savedTeam = await newTeam.save();
        return res.status(201).json(savedTeam);
    } catch (err) {
        console.error("Error creating team:", err);
        return res.status(500).json({ error: err.message || "Failed to create team." });
    }
});

// Get Teams
app.get("/api/teams", async (req, res) => {
    try {
        const teams = await Team.find();
        if (teams.length === 0) {
            return res.status(404).json({ message: "No teams found" });
        }
        res.status(200).json(teams);
    } catch (err) {
        console.error("Error fetching teams:", err);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});

// Add Team Members
app.post('/api/teams/:teamId/members', async (req, res) => {
    const { teamId } = req.params;
    const { firstName, lastName, username, email } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const newMember = {
            firstName,
            lastName,
            username,
            email,
            isActive: true,
            role: "Member",
        };

        team.members.push(newMember);
        await team.save();

        res.status(200).json({ message: 'Member added successfully', team });
    } catch (error) {
        console.error('Error adding member:', error.message);
        res.status(500).json({ error: 'An error occurred while adding the member' });
    }
});

// Delete Team Members
app.delete('/api/teams/:teamId/members', async (req, res) => {
    const { teamId } = req.params;
    const { email } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const memberIndex = team.members.findIndex(member => member.email === email);
        if (memberIndex === -1) {
            return res.status(404).json({ error: 'Member not found in the team' });
        }

        team.members.splice(memberIndex, 1);
        await team.save();

        res.status(200).json({ message: 'Member deleted successfully', team });
    } catch (error) {
        console.error('Error deleting member:', error.message);
        res.status(500).json({ error: 'An error occurred while deleting the member' });
    }
});

// Delete Team
app.delete('/api/teams/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const deletedTeam = await Team.findByIdAndDelete(teamId);
        if (!deletedTeam) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({ message: 'Team deleted successfully', deletedTeam });
    } catch (error) {
        console.error('Error deleting team:', error.message);
        res.status(500).json({ error: 'An error occurred while deleting the team' });
    }
});



//Task APIs

//create tasks post
app.post('/api/tasks', async (req, res) => {
    const { title, description, assignedUser, status, position } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            status,
            position,
            assignedUser,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//Get All Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedUser');
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//Get Task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
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
app.put('/api/tasks/:id', async (req, res) => {
    const { title, description, assignedUser } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id },
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
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
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
app.patch('/api/tasks/:id/status', async (req, res) => {
    const { status } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id },
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
app.patch('/api/tasks/:id/move', async (req, res) => {
    const { position } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id },
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
