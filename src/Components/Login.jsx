import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const USER = {
  email: "vishnu@gmail.com",
  // password: Abcd@1234 hashed with SHA-256
  passwordHash:
    "efc8fba9489b1d63fb2efe99f2695aa40a8e3ee9c00738145ddd632f8c4c39d2",
};

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null); 

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");
    setAuthError("");
    setPasswordStatus(null);
    let valid = true;

    if (!email) {
      setErrorEmail("Required*");
      valid = false;
    } else {
      setErrorEmail("");
    }

    if (!password) {
      setErrorPassword("Required*");
      valid = false;
    } else {
      setErrorPassword(""); 
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(async () => {
      if (email !== USER.email) {
        setLoading(false);
        setPasswordStatus("error");
        setAuthError("Invalid email or password");
        return;
      }
      const hashed = await hashPassword(password);
      if (hashed !== USER.passwordHash) {
        setLoading(false);
        setPasswordStatus("error");
        setAuthError("Invalid email or password");
        return;
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      setLoading(false);
      setPasswordStatus("success");
      navigate("/home");
    }, 800);
  };

  if (loading) {
    return (
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.7)", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300, 
          }}
        >
          <CircularProgress size={80} />
        </Box>

      </Container>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      sx={{ px: 2 }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", mx: 1 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Sign in to continue.
          </Typography>
          <form onSubmit={handleLogin} autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errorEmail)}
              helperText={errorEmail}
              autoFocus
              inputProps={{ "data-testid": "email-input" }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errorPassword)}
              helperText={errorPassword}
              inputProps={{ "data-testid": "password-input" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{
                        color:
                          passwordStatus === "error"
                            ? "error.main"
                            : passwordStatus === "success"
                            ? "success.main"
                            : undefined,
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {authError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {authError}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
