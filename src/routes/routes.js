import ActualizarPokemon from "../pages/ActualizarPokemon";
import DashboardPage from "../pages/DashboardPage";
import PokeApiPage from "../pages/PokeApiPage";
import RegistrarPokemon from "../pages/RegistrarPokemon";

const routes = {
  public: [
    // { path: "/", component: App },
  ],
  private: [
    { path: "/", component: DashboardPage },
    { path: "/poke-api", component: PokeApiPage },
    { path: "/registrar-pokemon", component: RegistrarPokemon },
    { path: "/actualizar-pokemon/:id", component: ActualizarPokemon },
  ],
};

export default routes;