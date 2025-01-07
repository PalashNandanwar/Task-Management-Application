/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpPage = ({ onEmailUpdate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred during sign-up");
            }

            const data = await response.json();
            console.log("User signed up successfully:", data);

            // Pass the email to the parent component
            if (onEmailUpdate) {
                onEmailUpdate(email);
            }

            // Redirect to the home page or dashboard
            navigate("/TaskBoard");
        } catch (error) {
            console.error("Error during sign up:", error);
            setError(error.message || "An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                            {loading ? "Signing up..." : "Sign Up"}
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
