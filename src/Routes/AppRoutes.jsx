// import React from 'react'

import { Route, Routes } from "react-router-dom"

import LoginPage from "../Pages/LoginPage"
import SignPage from "../Pages/SignPage"
import HomePage from "../Pages/HomePage"

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/SignUp" element={<SignPage />} />

            </Routes>
        </>
    )
}

export default AppRoutes