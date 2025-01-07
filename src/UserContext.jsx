/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import { useState } from "react";

export const UserProvider = ({ children }) => {
    let initialUser = null;

    try {
        const storedUser = localStorage.getItem('user');
        initialUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // In case of an error, fall back to null
        initialUser = null;
    }

    const [user, setUser] = useState(initialUser);

    const setUserData = (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));  // Save to localStorage
            setUser(userData);  // Update state
        } catch (error) {
            console.error("Error saving user data to localStorage:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
