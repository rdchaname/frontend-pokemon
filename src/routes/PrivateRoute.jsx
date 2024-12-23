import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        // Puedes mostrar un spinner o simplemente devolver `null` mientras se carga
        return <div>Cargando...</div>;
    }

    return token ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.any.isRequired
}

export default PrivateRoute;
