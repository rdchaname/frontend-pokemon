import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Opciones del menú
    const menuItems = [
        { label: "Inicio", path: "/" },
        { label: "PokeAPI", path: "/poke-api" },
        { label: "Registrar", path: "/registrar-pokemon" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Pokemon APP</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {menuItems.map((item, index) => (
                            <li className="nav-item" key={index}>
                                <NavLink
                                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                    to={item.path}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <span className="nav-link">Hola, {user || "Usuario"}</span>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
