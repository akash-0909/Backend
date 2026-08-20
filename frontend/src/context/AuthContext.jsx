import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get currently logged-in user
    const getCurrentUser = async () => {
        try {
            const response = await api.get("/users/current-user");

            setUser(response.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (credentials) => {
        const response = await api.post("/users/login", credentials);

        setUser(response.data.data.user);

        return response.data;
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/users/logout");
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout,
                getCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};