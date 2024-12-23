import api from './axiosConfig';

export const sincronizar = async (nombre) => {
    try {
        const response = await api.post(`/pokemon/sincronizar/${nombre}`);
        return response.data;
    } catch (error) {
        let messageError = "";
        if (error.response.data.value.ERROR) {
            messageError = error.response.data.value.ERROR;
        } else {
            messageError = "Error al obtener datos de la API"
        }
        throw messageError;
    }
};

export const obtenerPokemon = async (id) => {
    try {
        const response = await api.get(`/pokemon/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
        throw error;
    }
};


export const listarTodos = async (numeroPagina, cantidadPorPagina) => {
    try {
        const response = await api.get(`/pokemon`, { params: { numeroPagina, cantidadPorPagina } });
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        throw error;
    }
};

export const registrarPokemon = async (formData) => {
    try {
        const response = await api.post("/pokemon", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        let messageError = "";
        if (error.response.data.value.ERROR) {
            messageError = error.response.data.value.ERROR;
        } else {
            messageError = "Error al registrar pokemon de la API"
        }
        throw messageError;
    }
};

export const actualizarPokemon = async (id, formData) => {
    try {
        const response = await api.put(`/pokemon/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        let messageError = "";
        if (error.response.data.value.ERROR) {
            messageError = error.response.data.value.ERROR;
        } else {
            messageError = "Error al actualizar pokemon de la API"
        }
        throw messageError;
    }
};


export const eliminarPokemon = async (id) => {
    try {
        const response = await api.delete(`/pokemon/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el Pokémon:", error);
        throw error;
    }
};
