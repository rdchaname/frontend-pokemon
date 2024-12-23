import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Nuevo estado

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) {
            setToken(savedToken);
        }
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false); // Finaliza la carga
    }, []);

    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.any.isRequired
}


export default AuthContext;
