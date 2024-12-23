import { useState, useEffect } from "react";
import { obtenerCantidadPorTipo, obtenerCantidadTotal, obtenerPromedioPoderCombate, obtenerTipos } from "../api/pokemonService";

const EstadisticasPage = () => {
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        promedioPoderCombate: 0,
        tipos: [],
        totalPorTipo: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            setLoading(true);
            try {
                const dataTotal = await obtenerCantidadTotal();
                const dataPromedioPoderCombate = await obtenerPromedioPoderCombate();
                const dataTipos = await obtenerTipos();
                const dataTotalPorTipo = await obtenerCantidadPorTipo();
                setEstadisticas({
                    total: dataTotal.value,
                    promedioPoderCombate: dataPromedioPoderCombate.value,
                    tipos: dataTipos.value,
                    totalPorTipo: dataTotalPorTipo.value
                })

            } catch (error) {
                console.error("Error al cargar las estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Estadísticas de pokemones</h1>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row">
                        {/* Card 1: Cantidad Total */}
                        <div className="col-md-4">
                            <div className="card text-white bg-primary mb-3">
                                <div className="card-header">Cantidad Total</div>
                                <div className="card-body">
                                    <h5 className="card-title">{estadisticas.total}</h5>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Promedio de Poder de Combate */}
                        <div className="col-md-4">
                            <div className="card text-white bg-success mb-3">
                                <div className="card-header">Promedio de Poder de Combate</div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {estadisticas.promedioPoderCombate.toFixed(2)}
                                    </h5>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Cantidad por Tipo */}
                        <div className="col-md-4">
                            <div className="card text-white bg-warning mb-3">
                                <div className="card-header">Cantidad por Tipo</div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <ul>
                                            {estadisticas.totalPorTipo.map((tipo, index) => (
                                                <li key={index}>
                                                    {`${tipo.Nombre} : ${tipo.Cantidad}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EstadisticasPage;
