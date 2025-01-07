/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
// import React from 'react'
import { FcParallelTasks } from "react-icons/fc";
import { Link } from "react-router-dom";




const NavBar = ({ userData }) => {
    return (
        <>
            <div className=" w-full h-auto bg-gray-100">
                <div >
                    <div className="flex justify-between items-center px-[4rem] py-[2rem]">
                        <Link to='/'>
                            <p className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-4xl uppercase font-bold text-[#2196f3]">WorkHive <span className=" text-5xl"><FcParallelTasks /></span> </p>
                        </Link>

                        {
                            userData ?
                                <div className="flex space-x-20">
                                    <Link to="/TaskBoard" className="text-lg font-medium text-gray-700 hover:text-[#2196f3] transition duration-200">
                                        Task Board
                                    </Link>
                                    <Link to="/TeamManagement" className="text-lg font-medium text-gray-700 hover:text-[#2196f3] transition duration-200">
                                        Team Management
                                    </Link>
                                    <Notification />
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
            </div>
        </>
    )
}

export default NavBar
