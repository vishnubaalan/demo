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
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const USER = {
  email: "vishnu@gmail.com",
  password: "Password123@",
};

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

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");
    setAuthError("");
    setPasswordStatus(null);
    let valid = true;

    if (!email) {
      setErrorEmail("Required*");
      valid = false;
    }

    if (!password) {
      setErrorPassword("Required*");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    setTimeout(() => {
      const emailOk = email === USER.email;
      const passwordOk = password === USER.password;

      if (!emailOk || !passwordOk) {
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
          <CircularProgress size={50} />
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <HomeRoundedIcon fontSize="large" />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Products
            </Typography>
          </Box>
          <Typography variant="body2" align="center" gutterBottom>
            <h4 style={{ fontWeight: "bold" }}>Welcome to Login</h4>
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
                      // sx={{
                      //   color:
                      //     passwordStatus === "error"
                      //       ? "error.main"
                      //       : passwordStatus === "success"
                      //       ? "success.main"
                      //       : undefined,
                      // }}
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
