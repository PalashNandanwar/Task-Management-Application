// // import React from 'react'

// import { FaHome } from "react-icons/fa"
// import { Link } from "react-router-dom"

// const SignPage = () => {
//     return (
//         <>
//             <div>
//                 <div className=' absolute left-0 top-0 m-[2rem]'>
//                     <Link to='/'>
//                         <button className=' text-indigo-600 text-lg capitalize font-semibold flex justify-center items-center gap-4 hover:border-2 hover:py-[7px] hover:px-[10px] hover:rounded-lg'>
//                             home <span className=''><FaHome /></span>
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default SignPage

import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeComponent from '../Components/HomeComponent';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle sign-up logic here
        console.log('Sign-up data:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

            <HomeComponent />

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2196f3] hover:bg-[#2195f3b1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up
                        </button>

                        <div className=' mt-8 text-base font-semibold'>
                            <p>Create New Accout
                                <Link to='/Login'>
                                    <span className=' text-indigo-600 hover:text-indigo-800'> Click Here</span>.
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
