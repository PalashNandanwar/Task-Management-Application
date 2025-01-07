/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomeComponent from '../Components/HomeComponent'; // Assuming you want to keep this component

const SignUpPage = ({ onUserSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // To navigate after successful signup

    useEffect(() => {
        // Retrieve user data from localStorage when the page loads
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setEmail(user.email);  // Set email from localStorage if available
        }
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();  // Prevent default form submission

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred during sign-up');
            }

            const data = await response.json();
            console.log(data.user);

            console.log('User signed up successfully:', data);

            // Save user data to localStorage
            const user = { email, password };  // Save email and password, but avoid storing sensitive info in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Optionally, call the parent component callback to notify the parent
            if (onUserSignUp) {
                onUserSignUp(user);  // Pass the user data to the parent component
            }

            // Navigate to home page after successful signup
            navigate('/');

        } catch (error) {
            console.error('Error during sign up:', error);
            setError(error.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <HomeComponent />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2196f3] hover:bg-[#2195f3b1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>

                        {error && <p className="mt-2 text-center text-red-600 text-sm">{error}</p>}

                        <div className="mt-8 text-base font-semibold">
                            <p>
                                Already have an account?
                                <Link to="/SignUp">
                                    <span className="text-indigo-600 hover:text-indigo-800"> Click Here</span> for login.
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
