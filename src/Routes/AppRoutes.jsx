import { Route, Routes } from "react-router-dom";
import { useState } from "react";


import HomePage from "../Pages/HomePage";
import TeamManagement from "../Pages/TeamManagement";
import TaskBoard from "../Pages/TaskBoard";
import SignUpPage from "../Pages/SignPage";
import LoginPage from "../Pages/LoginPage";
import Profile from "../Pages/Profile";

const AppRoutes = () => {
    const [userEmail, setUserEmail] = useState("");

    // Handler to receive the email ID from LoginPage
    const handleFormDataSubmit = (signUpEmail) => {
        setUserEmail(signUpEmail); // Extract and set the email
    };

    console.log("User Email :- " + userEmail);

    return (
        <Routes>
            {/* Home Page */}
            <Route
                path="/"
                element={<HomePage userEmail={userEmail} />}
            />

            {/* Sign Up Route */}
            <Route
                path="/SignUp"
                element={<LoginPage onFormDataSubmit={handleFormDataSubmit} />}
            />

            {/* Sign In Route */}
            <Route
                path="/SignIn"
                element={<SignUpPage onEmailUpdate={handleFormDataSubmit} />}
            />

            {/* Protected Dashboard Route (You can add authentication logic here) */}
            <Route path="/TaskBoard" element={<TaskBoard />} />
            <Route path="/TeamManagement" element={<TeamManagement />} />
            <Route path="/Profile" element={<Profile userEmail={userEmail} setUserEmail={setUserEmail} />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
