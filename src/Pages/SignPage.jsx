import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // To navigate after successful signup

    const handleSignUp = async (e) => {
        e.preventDefault();  // Prevent default form submission

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
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
            console.log('User signed up successfully:', data);

            // Optionally store user data or redirect to login page
            navigate('/');  // Redirect to login page after successful signup

        } catch (error) {
            console.error('Error during sign up:', error);
            setError(error.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default SignUpPage;
