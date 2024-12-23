import api from './axiosConfig';

export const consultarListadoPokeApi = async (limit, offset) => {
    try {
        const response = await api.get('/PokeApi', { params: { limit: limit, offset: offset } });
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        throw error;
    }
};