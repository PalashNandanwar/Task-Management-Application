import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import LoginPage from "../Pages/LoginPage";
import SignPage from "../Pages/SignPage";
import HomePage from "../Pages/HomePage";
import TeamManagement from "../Pages/TeamManagement";
import TaskBoard from "../Pages/TaskBoard";

const AppRoutes = () => {
    const [formDataFromLogin, setFormDataFromLogin] = useState(null);

    const handleFormData = (formData) => {
        setFormDataFromLogin(formData);
        console.log("Form Data received:", formData);
    };

    return (
        <>
            <Routes>
                {/* Home Page */}
                <Route
                    path="/"
                    element={<HomePage userData={formDataFromLogin} />}
                />

                {/* Sign Up Route */}
                <Route
                    path="/SignUp"
                    element={<LoginPage onFormDataSubmit={handleFormData} />}
                />

                {/* Sign In Route */}
                <Route
                    path="/SignIn"
                    element={<SignPage userData={formDataFromLogin} />}
                />

                {/* Protected Dashboard Route */}
                <Route path="/TaskBoard" element={<TaskBoard />} />
                <Route path="/TeamManagement" element={<TeamManagement />} />

                {/* Fallback 404 Route */}
                <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
        </>
    );
};

export default AppRoutes;
