// import React from 'react'

import { Route, Routes } from "react-router-dom"

import LoginPage from "../Pages/LoginPage"
import SignPage from "../Pages/SignPage"
import HomePage from "../Pages/HomePage"
import { useState } from "react"
import Dashboard from "../Pages/Dashboard"

const AppRoutes = () => {

    const [formDataFromLogin, setFormDataFromLogin] = useState(null);

    const handleFormData = (formData) => {
        setFormDataFromLogin(formData);
        console.log('Form Data received:', formData);
    };


    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage userData={formDataFromLogin} />} />
                <Route path="/SignUp" element={<LoginPage onFormDataSubmit={handleFormData} />} />
                <Route path="/SignIn" element={<SignPage userData={formDataFromLogin} />} />
                <Route path="/Dashboard" element={<Dashboard userData={formDataFromLogin} />} />
            </Routes>
        </>
    )
}

export default AppRoutes