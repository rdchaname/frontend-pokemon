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


export const listarTodos = async (numeroPagina, cantidadPorPagina, busqueda, tipo) => {
    try {
        const response = await api.get(`/pokemon`, { params: { numeroPagina, cantidadPorPagina, busqueda, tipo} });
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


export const obtenerCantidadTotal = async () => {
    try {
        const response = await api.get(`/pokemon/obtenerCantidadTotal`);
        return response.data;
    } catch (error) {
        console.error("Error al obtenerCantidadTotal del API:", error);
        throw error;
    }
};

export const obtenerCantidadPorTipo = async () => {
    try {
        const response = await api.get(`/pokemon/obtenerCantidadPorTipo`);
        return response.data;
    } catch (error) {
        console.error("Error al obtenerCantidadPorTipo del API:", error);
        throw error;
    }
};

export const obtenerPromedioPoderCombate = async () => {
    try {
        const response = await api.get(`/pokemon/obtenerPromedioPoderCombate`);
        return response.data;
    } catch (error) {
        console.error("Error al obtenerPromedioPoderCombate del API:", error);
        throw error;
    }
};

export const obtenerTipos = async () => {
    try {
        const response = await api.get(`/pokemon/obtenerTipos`);
        return response.data;
    } catch (error) {
        console.error("Error al obtenerTipos del API:", error);
        throw error;
    }
};