import api from './axiosConfig';

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.hasSucceeded) {
        localStorage.setItem('token', response.data.value.token);
        return response.data;
    } else {
        throw "Error";
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        return user;
    } catch (error) {
        console.error('Error decoding token', error);
        return null;
    }
};
