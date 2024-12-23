import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import routes from './routes/routes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {routes.private.map((item) => {
            return <Route key={item.path} path={item.path} element={<PrivateRoute>
              <MainLayout>
                <item.component />
              </MainLayout>
            </PrivateRoute>} />
          })}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
