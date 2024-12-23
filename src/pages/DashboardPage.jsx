import { useEffect } from "react";
import { useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import { eliminarPokemon, listarTodos } from "../api/pokemonService";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {

  const [pokemons, setPokemons] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const cantidadPorPagina = 20;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null); // Mensajes de alerta

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await listarTodos(currentPage, cantidadPorPagina);
        const listado = data.value.data;
        const cantidad = data.value.total;
        setPokemons(listado);
        setTotalCount(cantidad);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / cantidadPorPagina);

  const generatePageNumbers = () => {
    const maxButtons = 5; // Número máximo de botones visibles
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditarPokemon = (id) => {
    navigate(`/actualizar-pokemon/${id}`);
  };

  const handleEliminarPokemon = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar el registro?');
    if (confirmed) {
      try {
        setLoading(true);
        const result = await eliminarPokemon(id);
        setAlert({ type: "success", message: result.message || "Registro exitoso." });

        const fetchData = async () => {
          try {
            const data = await listarTodos(currentPage, cantidadPorPagina);
            const listado = data.value.data;
            const cantidad = data.value.total;
            setPokemons(listado);
            setTotalCount(cantidad);
          } catch (error) {
            console.error("Error al cargar los datos:", error);
          } finally {
            setLoading(false); // Desactivar el estado de carga
          }
        };
        fetchData();
      } catch (error) {
        setAlert({ type: "danger", message: "Error al registrar el Pokémon." });
      } finally {
        setLoading(false);
        setTimeout(() => setAlert(null), 3000); // Ocultar alerta después de 3 segundos
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Listado de Pokémon desde base de datos local</h1>
      <h4 className="mb-4">Cantidad de pokemones {totalCount}</h4>
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
                  <th>Tipo</th>
                  <th>Poder de combate</th>
                  <th>Fecha de captura</th>
                  <th>Imagen</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {pokemons.map((pokemon, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * cantidadPorPagina + index + 1}</td>
                    <td>{pokemon.nombre}</td>
                    <td>{pokemon.tipo}</td>
                    <td>{pokemon.poderCombate}</td>
                    <td>{pokemon.fechaCaptura}</td>
                    <td>
                      {
                        pokemon.imagen ? (<img src={`http://localhost:5091/${pokemon.imagen}`} width={"100px"} />) : 'no hay imagen'
                      }
                    </td>
                    <td>
                      <button type="button" onClick={() => handleEditarPokemon(pokemon.id)} className="btn btn-sm btn-warning mx-2"><BsFillPencilFill />Editar</button>
                      <button type="button" onClick={() => handleEliminarPokemon(pokemon.id)} className="btn btn-sm btn-danger"><BsFillTrash3Fill />Eliminar</button>
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

export default DashboardPage