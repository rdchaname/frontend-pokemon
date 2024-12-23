import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registrarPokemon } from "../api/pokemonService";

const RegistrarPokemon = () => {
    const [alert, setAlert] = useState(null); // Estado para mensajes de alerta
    const [loading, setLoading] = useState(false);

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
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true);

                // Crear FormData para enviar los datos
                const formData = new FormData();
                formData.append("nombre", values.nombre);
                formData.append("tipo", values.tipo);
                if (values.poderCombate) formData.append("poderCombate", values.poderCombate);
                if (values.imagen) formData.append("imagen", values.imagen);

                const result = await registrarPokemon(formData);
                setAlert({ type: "success", message: result.message || "Registro exitoso." });
                resetForm(); // Limpiar el formulario después del registro exitoso
            } catch (error) {
                setAlert({ type: "danger", message: error});
            } finally {
                setLoading(false);
                setTimeout(() => setAlert(null), 3000); // Ocultar alerta después de 3 segundos
            }
        },
    });

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Registrar Pokémon</h1>

            {/* Mensaje de alerta */}
            {alert && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}

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
                    disabled={loading} // Deshabilitar mientras se registra
                >
                    {loading ? "Registrando..." : "Registrar"}
                </button>
            </form>
        </div>
    );
};

export default RegistrarPokemon;
