import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import HomeComponent from '../Components/HomeComponent';

// eslint-disable-next-line react/prop-types
const Profile = ({ userEmail, setUserEmail }) => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const storedUserData = localStorage.getItem(userEmail);
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setEditData(JSON.parse(storedUserData));
        }
    }, [userEmail]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const saveProfile = () => {
        setUserData(editData);
        localStorage.setItem(userEmail, JSON.stringify(editData));
        setIsEditing(false);
    };

    // Function to handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }), // Sending email in the request
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred during logout');
            }

            const data = await response.json();
            console.log('User logged out successfully:', data);

            // Clear user data and reset userEmail in parent component
            setUserEmail(null);
            navigate('/'); // Redirect to the home page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <HomeComponent />
            <div className="flex flex-col items-center space-y-4">
                {/* Profile Picture */}
                <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full shadow-md object-cover"
                />

                {/* Profile Info */}
                {!isEditing ? (
                    <>
                        <h1 className="text-2xl font-bold">{`Name :- ${userData.firstName + " " + userData.lastName}`}</h1>
                        <p className="text-gray-600">{`User Email Id :- ${userData.email}`}</p>
                        <p className="text-center text-gray-800">{`User Name :-  ${userData.username}`}</p>
                        <p className="text-center text-gray-800">{userData.bio}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Edit Profile
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout} // Call handleLogout on logout button click
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4 w-full">
                        {/* Editable Fields */}
                        <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled
                        />
                        <textarea
                            name="bio"
                            value={editData.bio}
                            onChange={handleInputChange}
                            placeholder="Write something about yourself"
                            rows="3"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={saveProfile}
                                className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
