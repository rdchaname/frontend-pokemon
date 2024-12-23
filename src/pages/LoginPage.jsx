import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../api/authService";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Requerido'),
      password: Yup.string().required('Requerido'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const data = await loginUser({ login: values.username, password: values.password });
        const token = data.value.token;
        const user = data.value.nombres;
        login(token, user);
        navigate("/");
      } catch (error) {
        setErrors({ password: 'Credenciales incorrectas. Inténtalo de nuevo.' });
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: "25rem" }}>
        <h3 className="card-title text-center">Iniciar sesión</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Correo electrónico</label>
            <input
              type="text"
              id="username"
              className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
              {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="invalid-feedback">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
