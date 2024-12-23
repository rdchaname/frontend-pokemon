import { useEffect } from "react";
import { useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import { eliminarPokemon, listarTodos, obtenerTipos } from "../api/pokemonService";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {

  const [pokemons, setPokemons] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cantidadPorPagina = 20;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await listarTodos(currentPage, cantidadPorPagina, busqueda, tipo);
        const dataTipos = await obtenerTipos();
        const listado = data.value.data;
        const cantidad = data.value.total;
        const listadoTipo = dataTipos.value;
        setPokemons(listado);
        setTotalCount(cantidad);
        setTipos(listadoTipo);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / cantidadPorPagina);

  const generatePageNumbers = () => {
    const maxButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNuevoPokemon = () => {
    navigate("/registrar-pokemon");
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
        setAlert({ type: "danger", message: error });
      } finally {
        setLoading(false);
        setTimeout(() => setAlert(null), 3000); // Ocultar alerta después de 3 segundos
      }
    }
  };

  const handleSearchChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleSelectChange = (event) => {
    setTipo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setBusqueda(busqueda);
    setTipo(tipo);

    const fetchData = async () => {
      try {
        const data = await listarTodos(currentPage, cantidadPorPagina, busqueda, tipo);
        const dataTipos = await obtenerTipos();
        const listado = data.value.data;
        const cantidad = data.value.total;
        const listadoTipo = dataTipos.value;
        setPokemons(listado);
        setTotalCount(cantidad);
        setTipos(listadoTipo);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Listado de Pokémon desde base de datos local</h1>
      <h4 className="mb-4">Cantidad de pokemones: {totalCount}</h4>
      <h4 className="mb-4"><button className="btn btn-success" type="button" onClick={() => handleNuevoPokemon()}>Nuevo</button></h4>
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
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSubmit} className="d-flex flex-column">
                {/* Caja de búsqueda */}
                <div className="mb-3">
                  <label htmlFor="search" className="form-label">
                    Buscar
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    value={busqueda}
                    onChange={handleSearchChange}
                    placeholder="Introduce un término de búsqueda"
                  />
                </div>

                {/* Select */}
                <div className="mb-3">
                  <label htmlFor="select" className="form-label">
                    Selecciona una opción
                  </label>
                  <select
                    className="form-select"
                    id="select"
                    value={tipo}
                    onChange={handleSelectChange}
                  >
                    <option value="">Todos...</option>
                    {
                      tipos.map((tipo, index) => (<option key={index} value={tipo}>{tipo}</option>))
                    }
                  </select>
                </div>

                {/* Botón de envío */}
                <button type="submit" className="btn btn-primary">
                  Buscar
                </button>
              </form>
            </div>
          </div>
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
                    <td className="align-middle">{(currentPage - 1) * cantidadPorPagina + index + 1}</td>
                    <td className="align-middle">{pokemon.nombre}</td>
                    <td className="align-middle">{pokemon.tipo}</td>
                    <td className="align-middle">{pokemon.poderCombate}</td>
                    <td className="align-middle">{pokemon.fechaCaptura}</td>
                    <td className="align-middle">
                      {
                        pokemon.imagen ? (<img src={`https://cibertecpokemonapiapi20241223140157.azurewebsites.net/${pokemon.imagen}`} width={"100px"} />) : 'no hay imagen'
                      }
                    </td>
                    <td className="align-middle">
                      <button type="button" onClick={() => handleEditarPokemon(pokemon.id)} className="btn btn-warning mx-2"><BsFillPencilFill className="mx-1" />Editar</button>
                      <button type="button" onClick={() => handleEliminarPokemon(pokemon.id)} className="btn btn-danger"><BsFillTrash3Fill className="mx-1" />Eliminar</button>
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