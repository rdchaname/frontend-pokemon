import { useEffect } from "react";
import { useState } from "react";
import { consultarListadoPokeApi } from "../api/pokeapiService";
import { BsArrowRepeat } from "react-icons/bs";
import { sincronizar } from "../api/pokemonService";

const PokeApiPage = () => {

  const [pokemons, setPokemons] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await consultarListadoPokeApi(limit, (currentPage - 1) * 20);
        const listado = data.value;
        setPokemons(listado);
        setTotalCount(1302);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / limit);

  const generatePageNumbers = () => {
    const maxButtons = 5; // Número máximo de botones visibles
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSincronizar = async (nombre) => {
    try {
      setLoading(true);
      const result = await sincronizar(nombre);
      setAlert({ type: "success", message: result.message || "Sincronización exitosa" });
    } catch (error) {
      console.log(error);
      setAlert({
        type: "danger",
        message: error,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 3000); // Oculta la alerta después de 3 segundos
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Listado de Pokémon desde PokeAPI</h1>
      {/* Mensaje de alerta */}
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      {/* Indicador de carga */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>URL</th>
                  <th>Sincronizar</th>
                </tr>
              </thead>
              <tbody>
                {pokemons.map((pokemon, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{pokemon.name}</td>
                    <td>
                      <a
                        href={pokemon.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pokemon.url}
                      </a>
                    </td>
                    <td>
                      <button disabled={loading} type="button" onClick={() => handleSincronizar(pokemon.name)} className="btn btn-sm btn-success"><BsArrowRepeat /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </li>
              {generatePageNumbers().map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default PokeApiPage