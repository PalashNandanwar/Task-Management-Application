// import React from 'react'

import { FaHome } from "react-icons/fa"
import { Link } from "react-router-dom"

const HomeComponent = () => {
    return (
        <div className=' absolute left-0 top-0 m-[2rem]'>
            <Link to='/'>
                <button className=' text-indigo-600 text-lg capitalize font-semibold flex justify-center items-center gap-4 hover:border-2 py-[7px] px-[10px] hover:rounded-lg outline-none'>
                    home <span className=''><FaHome /></span>
                </button>
            </Link>
        </div>
    )
}

export default HomeComponent