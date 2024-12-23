import { useState, useEffect } from "react";
import { obtenerCantidadPorTipo, obtenerCantidadTotal, obtenerPromedioPoderCombate, obtenerTipos } from "../api/pokemonService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const EstadisticasPage = () => {
    const [graficoData, setGraficoData] = useState([]);
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
                setGraficoData(dataTotalPorTipo.value);

            } catch (error) {
                console.error("Error al cargar las estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, []);

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const chartData = {
        labels: graficoData.map((item) => item.Nombre), // Extraemos los tipos de la data
        datasets: [
            {
                data: graficoData.map((item) => item.Cantidad), // Extraemos las cantidades
                backgroundColor: graficoData.map(() => generateRandomColor()), // Colores para los segmentos
                hoverBackgroundColor: graficoData.map(() => generateRandomColor()), // Colores al hacer hover
            },
        ],
    };

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
                        {/* Card 3: Grafico Cantidad por Tipo */}
                        <div className="col-md-4">
                            <div className="card mb-3">
                                <div className="card-header">Cantidad por Tipo</div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <Pie data={chartData} />
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
