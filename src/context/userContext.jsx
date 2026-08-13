import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/auth";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${API_URL}/me`, { credentials: "include" });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to fetch user");

                setUser(data.user);
            } catch (err) {
                console.error("Failed to fetch current user:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
}