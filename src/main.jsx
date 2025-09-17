import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { CartProvider } from "./context/CartContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a3864" },
    secondary: { main: "#1a3864" },
    background: { default: "#fafafa" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: "0 2px 10px rgba(0,0,0,0.08)" } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: "outlined" } },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
