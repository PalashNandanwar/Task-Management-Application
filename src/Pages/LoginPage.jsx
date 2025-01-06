/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Add useNavigate
import HomeComponent from '../Components/HomeComponent';

const LoginPage = ({ onFormDataSubmit }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    console.log(formData);

    onFormDataSubmit(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                alert(`Error: ${data.message}`);
                return;
            }

            alert('User registered successfully!');
            console.log('Success:', data.message);

            // Pass the formData to the parent component
            // if (onFormDataSubmit) {

            // }

            // Redirect to home page after successful sign-up
            navigate('/');
        } catch (error) {
            console.error('Error during fetch:', error.message);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <HomeComponent />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign In Page</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                        <div className="flex gap-2">
                            <div>
                                <label htmlFor="firstName" className="sr-only">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="sr-only">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            Login
                        </button>

                        <div className="mt-8 text-base font-semibold">
                            <p>
                                Already Sign in
                                <Link to="/SignIn">
                                    <span className="text-indigo-600 hover:text-indigo-800"> Click Here</span>.
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
