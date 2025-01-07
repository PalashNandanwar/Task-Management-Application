/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
// import React from 'react'

import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { MdDashboardCustomize } from "react-icons/md";

const HomePage = ({ userEmail }) => {
    return (
        <>
            {console.log("userDAta" + userEmail)}
            <NavBar userData={userEmail} />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl w-full space-y-8 text-center bg-white p-10 rounded-lg shadow-xl">
                    <h1 className="text-5xl font-extrabold text-gray-900">Welcome to <span className="text-indigo-600">WorkHive</span></h1>
                    <p className="mt-4 text-xl text-gray-700">
                        Experience the next level of task management with <span className="font-semibold text-[#2196f3] ">WorkHive</span>. Designed for individuals and teams, WorkHive offers a seamless way to organize, collaborate, and achieve goals effortlessly.
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Effortless Task Management</h3>
                            <p className="mt-2 text-gray-700">Create, organize, and manage your tasks in a simple, intuitive interface.</p>
                        </div>
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Set Priorities</h3>
                            <p className="mt-2 text-gray-700">Assign deadlines and prioritize tasks to stay on track.</p>
                        </div>
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Real-Time Collaboration</h3>
                            <p className="mt-2 text-gray-700">Work with your team seamlessly, sharing updates and progress in real-time.</p>
                        </div>
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Insightful Analytics</h3>
                            <p className="mt-2 text-gray-700">Track performance with detailed analytics and insights.</p>
                        </div>
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Customizable Workflows</h3>
                            <p className="mt-2 text-gray-700">Adapt task categories and workflows to fit your unique needs.</p>
                        </div>
                        <div className="bg-indigo-100 p-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-lg font-semibold text-[#2196f3]">Access Anywhere</h3>
                            <p className="mt-2 text-gray-700">Use WorkHive on any device with seamless cross-platform support.</p>
                        </div>
                    </div>

                    <p className="mt-8 text-lg text-gray-700">
                        WorkHive is trusted by professionals and teams worldwide. With powerful tools and an easy-to-use interface, it’s the ultimate solution for managing tasks effectively.
                    </p>
                    <p className="mt-4 text-lg text-gray-700 font-medium">
                        Ready to elevate your productivity?
                        <Link to='/SignUp'>
                            <span className="text-[#2196f3]"> Sign up </span>
                        </Link>
                        today and transform the way you work!
                    </p>
                </div>
                <div className="mt-10">
                    {
                        userEmail ?
                            <div>
                                <Link to='/Dashboard'>
                                    <button className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-xl uppercase font-bold">
                                        Dashboard <span ><MdDashboardCustomize /></span>
                                    </button>
                                </Link>
                            </div>
                            :
                            <div>
                                <Link to='/SignUp'>
                                    <button className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-xl uppercase font-bold text-[#2196f3]">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                    }
                </div>
            </div>


        </>
    );
};

export default HomePage;
