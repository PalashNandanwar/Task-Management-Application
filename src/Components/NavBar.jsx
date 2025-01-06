/* eslint-disable react/jsx-no-undef */
// import React from 'react'
import { FcParallelTasks } from "react-icons/fc";
import { Link } from "react-router-dom";



const NavBar = () => {
    return (
        <>
            <div className=" w-full h-auto bg-gray-100">
                <div >
                    <div className="flex justify-start">
                        <Link to='/'>
                            <p className="flex justify-center items-center px-[4rem] py-[2rem] gap-[1rem] text-4xl uppercase font-bold text-[#2196f3]">WorkHive <span className=" text-5xl"><FcParallelTasks /></span> </p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar