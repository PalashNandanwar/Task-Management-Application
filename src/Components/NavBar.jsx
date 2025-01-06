/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
// import React from 'react'
import { FcParallelTasks } from "react-icons/fc";
import { Link } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";




const NavBar = ({ userData }) => {
    return (
        <>
            <div className=" w-full h-auto bg-gray-100">
                <div >
                    <div className="flex justify-between">
                        <Link to='/'>
                            <p className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-4xl uppercase font-bold text-[#2196f3]">WorkHive <span className=" text-5xl"><FcParallelTasks /></span> </p>
                        </Link>

                        {
                            userData ?
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
            </div>
        </>
    )
}

export default NavBar