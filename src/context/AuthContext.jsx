import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // 👉 login real contra el backend
    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch(
                'http://ec2-3-216-249-17.compute-1.amazonaws.com:3000/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (!response.ok) throw new Error('Credenciales inválidas');

            const data = await response.json();

            // Guarda token + usuario
            setToken(data.access_token);
            setUser(data.user || { username });
            localStorage.setItem('token', data.access_token);
        } catch (err) {
            console.error('Error en login:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
