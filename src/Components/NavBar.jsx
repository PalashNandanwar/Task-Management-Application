/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import { FcParallelTasks } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "./Notification";
import { CgProfile } from "react-icons/cg";

const NavBar = ({ userData }) => {
    const [userEmail, setUserEmail] = useState(null);

    // Fetch user data from localStorage on component mount
    useEffect(() => {
        const storedUserData = localStorage.getItem(userEmail); // Replace with your actual key
        if (userData) {
            setUserEmail(userData); // Use prop if provided
        }
        console.log(storedUserData);

    }, []);



    return (
        <div className="w-full h-auto bg-gray-100">
            <div>
                <div className="flex justify-between">
                    <Link to="/">
                        <p className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-4xl uppercase font-bold text-[#2196f3]">
                            WorkHive
                            <span className="text-5xl">
                                <FcParallelTasks />
                            </span>
                        </p>
                    </Link>

                    {/* Conditional Rendering */}
                    {userEmail ? (
                        <div className="flex justify-center items-center space-x-20 px-[4rem] py-[2rem]">
                            <Link
                                to="/TaskBoard"
                                className="text-lg font-medium text-gray-700 hover:text-[#2196f3] transition duration-200"
                            >
                                Task Board
                            </Link>
                            <Link
                                to="/TeamManagement"
                                className="text-lg font-medium text-gray-700 hover:text-[#2196f3] transition duration-200"
                            >
                                Team Management
                            </Link>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        // localStorage.removeItem(userData); // Clear user data
                                        setUserEmail(null); // Reset user data
                                        
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                            <Notification />
                            <Link to='/Profile'>
                                <span><CgProfile /></span>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link to="/SignUp">
                                <button className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-xl uppercase font-bold text-[#2196f3]">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
