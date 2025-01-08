/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import HomeComponent from "../Components/HomeComponent";

// Utility function for fetching data
const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

const TeamManagement = ({ userEmail }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [userData, setUserData] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);  // Store the full team object
    const [teamMembers, setTeamMembers] = useState([]);  // Store members of the selected team
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [isAddMemberFormVisible, setIsAddMemberFormVisible] = useState(false);

    // Handle team selection
    const handleTeamClick = (teamId) => {
        const selected = teams.find((team) => team._id === teamId);
        setSelectedTeam(selected);
        setTeamMembers(selected ? selected.members : []);  // Set team members if available
        setIsAddMemberFormVisible(true);  // Show the add member form when a team is selected
    };

    // Handle delete team
    const handleDeleteTeam = async (teamId) => {
        const confirmation = window.confirm(`Are you sure you want to delete this team?`);
        if (confirmation) {
            try {
                await fetchData(`http://localhost:5000/api/teams/${teamId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                alert('Team deleted successfully!');
                fetchTeams();  // Refresh the teams list
            } catch (error) {
                alert('Error deleting team' + error);
            }
        }
    };

    // Fetch user data to get the ownerId
    const fetchUserData = async (userEmail) => {
        try {
            return await fetchData(`http://localhost:5000/user?email=${encodeURIComponent(userEmail)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            alert("Error fetching user data." + error);
            return null;
        }
    };

    // Fetch teams from backend
    const fetchTeams = async () => {
        try {
            const teams = await fetchData(`http://localhost:5000/api/teams`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            setTeams(teams);  // Set the fetched teams in the state
        } catch (error) {
            console.error('Error fetching teams:', error.message);
        }
    };

    // Create the team
    const createTeam = async (teamName, description, userData) => {
        try {
            const teamData = await fetchData(`http://localhost:5000/api/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: teamName,
                    description,
                    members: [
                        {
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            username: userData.username,
                            email: userData.email,
                            isActive: userData.isActive,
                            role: "Admin", // Owner is the admin
                        },
                    ],
                }),
            });
            alert('Team created successfully!');
            return teamData;
        } catch (error) {
            console.error('Error creating team:', error.message);
        }
    };

    // Handle the form submission for creating team
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (teamName && description && userData) {
            const teamData = await createTeam(teamName, description, userData);
            if (teamData) {
                setIsFormVisible(false); // Hide form after submission
                fetchTeams(); // Refresh team list
            }
        } else {
            alert('Please fill all the fields.');
        }
    };

    // Handle cancel form action
    const handleCancel = () => {
        setIsFormVisible(false); // Hide form without submitting
        setTeamName(''); // Reset team name input
        setDescription(''); // Reset description input
    };

    // Add Members to the Group
    const handleAddMember = async () => {
        if (!newMemberEmail) {
            alert("Please enter a valid email.");
            return;
        }

        // Fetch user data for new member
        const memberData = await fetchUserData(newMemberEmail);
        if (!memberData) {
            alert("User not found.");
            return;
        }

        const member = {
            firstName: memberData.firstName,
            lastName: memberData.lastName,
            username: memberData.username,
            email: newMemberEmail,
            isActive: memberData.isActive,
            role: "Member",
        };

        try {
            await addMemberToTeam(selectedTeam._id, member);  // Use selectedTeam._id
            setNewMemberEmail('');
            setIsAddMemberFormVisible(false);
            fetchTeams();  // Refresh teams list after adding a member
        } catch (error) {
            console.error('Error adding member:', error.message);
            alert("Error adding member.");
        }
    };

    // Add member to team
    const addMemberToTeam = async (teamId, memberData) => {
        try {
            await fetchData(`http://localhost:5000/api/teams/${teamId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData),
            });
            alert('Member added successfully!');
        } catch (error) {
            alert("Error adding member." + error);
        }
    };

    const deleteMemberFromTeam = async (teamId, memberEmail) => {
        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}/members`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: memberEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while deleting the member');
            }

            const data = await response.json();
            console.log('Member deleted successfully:', data);
            alert(data.message);  // Display success message
        } catch (error) {
            console.error('Error deleting member:', error.message);
            alert(error.message || 'An error occurred while deleting the member');
        }
    };

    // Fetch user data and teams when component mounts
    useEffect(() => {
        fetchTeams();  // Fetch teams immediately
        if (userEmail) {
            fetchUserData(userEmail).then((data) => setUserData(data)); // Store user data
        }
    }, [userEmail]);

    return (
        <div>
            <div className="p-6 bg-gray-100 min-h-screen mt-[4rem]">
                <HomeComponent />
                <h1 className="text-3xl font-bold mb-4">Team Management</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="container mx-auto p-4">
                        <div>
                            <button
                                onClick={() => setIsFormVisible(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Create Group
                            </button>
                        </div>

                        {/* Conditional Rendering of Form */}
                        {isFormVisible && (
                            <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">Create a New Team</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            id="teamName"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="4"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Create Team
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Render Teams */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold">Teams</h3>
                            {teams.map((team) => (
                                <div key={team._id} className="flex justify-between items-center border-b pb-2 mb-2">
                                    <div>
                                        <span className="text-lg">{team.name}</span>
                                        <p className="text-sm text-gray-600">{team.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTeamClick(team._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Manage Members
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeam(team._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Show members of the selected team */}
                            {selectedTeam && (
                                <div className="mt-6">
                                    <h4 className="text-xl font-semibold">Members of {selectedTeam.name}</h4>
                                    <ul className="flex flex-col gap-4 pl-5 mt-2">
                                        {teamMembers.map((member) => (
                                            <li key={member.email} className="flex justify-between items-center text-sm border-2 text-gray-700 px-[1rem] py-[0.5rem]">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-lg">{member.username}</span>
                                                    <span className="text-base">{member.firstName} {member.lastName}</span>
                                                    <span>{member.email}</span>
                                                </div>
                                                <div className="flex flex-col justify-center items-center gap-3">
                                                    <span>{member.role}</span>
                                                    <button
                                                        onClick={() => deleteMemberFromTeam(selectedTeam._id, member.email)}
                                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        Delete Member
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Show Add Member Form if team is selected */}
                        {isAddMemberFormVisible && selectedTeam && (
                            <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">Add Member to Team</h3>
                                <div className="mb-4">
                                    <label htmlFor="newMemberEmail" className="block text-sm font-medium text-gray-700">
                                        Member&#39;s Email
                                    </label>
                                    <input
                                        type="email"
                                        id="newMemberEmail"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleAddMember}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add Member
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
