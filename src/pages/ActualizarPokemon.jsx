import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { actualizarPokemon, obtenerPokemon } from "../api/pokemonService";

const ActualizarPokemon = () => {
    const { id } = useParams(); // Obtiene el ID desde la URL
    const navigate = useNavigate(); // Para redirigir después de actualizar
    const [alert, setAlert] = useState(null); // Mensajes de alerta
    const [loading, setLoading] = useState(false); // Estado de carga
    const [initialValuesLoaded, setInitialValuesLoaded] = useState(false); // Control de carga inicial

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        nombre: Yup.string()
            .required("El Nombre es obligatorio")
            .min(2, "Debe tener al menos 2 caracteres"),
        tipo: Yup.string()
            .required("El Tipo es obligatorio")
            .min(2, "Debe tener al menos 2 caracteres"),
        poderCombate: Yup.number()
            .nullable()
            .min(0, "El Poder de Combate no puede ser negativo"),
        imagen: Yup.mixed().nullable(),
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            nombre: "",
            tipo: "",
            poderCombate: "",
            imagen: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);

                // Crear FormData para enviar los datos
                const formData = new FormData();
                formData.append("nombre", values.nombre);
                formData.append("tipo", values.tipo);
                if (values.poderCombate) formData.append("poderCombate", values.poderCombate);
                if (values.imagen) formData.append("imagen", values.imagen);

                const result = await actualizarPokemon(id, formData);
                setAlert({ type: "success", message: result.message || "Actualización exitosa." });
                setTimeout(() => navigate("/"), 3000); // Redirige después de 3 segundos
            } catch (error) {
                setAlert({ type: "danger", message: error });
            } finally {
                setLoading(false);
            }
        },
    });

    // Cargar los datos iniciales del Pokémon
    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            try {
                const pokemon = await obtenerPokemon(id);
                formik.setValues({
                    nombre: pokemon.value.nombre,
                    tipo: pokemon.value.tipo,
                    poderCombate: pokemon.value.poderCombate || "",
                    imagen: null, // La imagen inicial no puede cargarse como archivo
                });
                setInitialValuesLoaded(true);
            } catch (error) {
                setAlert({ type: "danger", message: "Error al cargar los datos del Pokémon." });
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [id]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Actualizar Pokémon</h1>

            {/* Mensaje de alerta */}
            {alert && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}

            {/* Indicador de carga */}
            {loading && !initialValuesLoaded ? (
                <div className="d-flex justify-content-center align-items-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                            Nombre <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formik.touched.nombre && formik.errors.nombre ? "is-invalid" : ""
                                }`}
                            id="nombre"
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.nombre && formik.errors.nombre && (
                            <div className="invalid-feedback">{formik.errors.nombre}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tipo" className="form-label">
                            Tipo <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formik.touched.tipo && formik.errors.tipo ? "is-invalid" : ""
                                }`}
                            id="tipo"
                            name="tipo"
                            value={formik.values.tipo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.tipo && formik.errors.tipo && (
                            <div className="invalid-feedback">{formik.errors.tipo}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="poderCombate" className="form-label">
                            Poder de Combate (opcional)
                        </label>
                        <input
                            type="number"
                            className={`form-control ${formik.touched.poderCombate && formik.errors.poderCombate
                                ? "is-invalid"
                                : ""
                                }`}
                            id="poderCombate"
                            name="poderCombate"
                            value={formik.values.poderCombate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.poderCombate && formik.errors.poderCombate && (
                            <div className="invalid-feedback">{formik.errors.poderCombate}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imagen" className="form-label">
                            Imagen (opcional)
                        </label>
                        <input
                            type="file"
                            className={`form-control ${formik.touched.imagen && formik.errors.imagen ? "is-invalid" : ""
                                }`}
                            id="imagen"
                            name="imagen"
                            accept="image/*"
                            onChange={(e) => formik.setFieldValue("imagen", e.target.files[0])}
                        />
                        {formik.touched.imagen && formik.errors.imagen && (
                            <div className="invalid-feedback">{formik.errors.imagen}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading} // Deshabilitar mientras se actualiza
                    >
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ActualizarPokemon;
