import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'https://cibertecpokemonapiapi20241223140157.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Si hay un error de tipo 401 (Unauthorized), manejamos la redirección
        if (error.response && error.response.status === 401) {
            // Eliminar el token del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirigir al inicio de sesión
            // window.location.href = '/login';  // O usa un redireccionamiento con React Router si es necesario

            // O si usas React Router:
            const navigate = useNavigate();
            navigate('/login');

            return Promise.reject(error); // Opcionalmente rechazar el error
        }

        // Si el error no es 401, simplemente lo dejamos pasar
        return Promise.reject(error);
    }
);

export default api;
