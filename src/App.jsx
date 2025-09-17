import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import ProductDetail from "./Components/ProductDetail";
import NavBar from "./Components/NavBar";
import Cart from "./Components/Cart";
import Toolbar from "@mui/material/Toolbar";

function Layout() {
  return (
    <>
      <NavBar />
      <Toolbar />
      <Outlet />
    </>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function PublicOnlyRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Navigate to="/home" replace /> : children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
