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
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Completed'],
            default: 'To Do'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
        assignees: [
            {
                id: {
                    type: String,    // Unique ID of the assignee (can be ObjectId if referring to a user collection)
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                }
            }
        ],
        createdBy: {
            id: {
                type: String,    // Unique ID of the creator (can be ObjectId if referring to a user collection)
                required: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            }
        }
    },
    { timestamps: true }  // Automatically create createdAt and updatedAt fields
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
    console.log('Request body:', req.body);
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

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Example of a protected route that requires authentication
app.get('/api/user', ensureLoggedIn, async (req, res) => {
    res.status(200).json({
        message: 'User authenticated successfully',
        user: req.user,
    });
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
    const { firstName, lastName, username, email, isActive } = req.body;

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
            isActive,
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


//Check user is in Team 
app.post('/api/teams/:teamId/isMember', async (req, res) => {
    const { teamId } = req.params;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the team by ID
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Check if the email exists in the team's members
        const isMember = team.members.some(member => member.email === email);

        if (isMember) {
            return res.status(200).json({ message: 'User is a member of the team' });
        } else {
            return res.status(404).json({ message: 'User is not a member of the team' });
        }
    } catch (error) {
        console.error('Error checking team membership:', error.message);
        return res.status(500).json({ error: 'An error occurred while checking membership' });
    }
});
//Task APIs

//create tasks post
app.post('/api/tasks', ensureLoggedIn, async (req, res) => {
    const { title, description, assignedUser, status, priority, position } = req.body;


    // Validate the status field
    // Validate the status field
    if (!['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    // Validate the priority field
    if (!['high', 'medium', 'low'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value. Please choose High, Medium, or Low.' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            status,
            priority,
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
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find(); // You can adjust this to fetch tasks without user filtering
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
