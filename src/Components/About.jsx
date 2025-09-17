import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CodeIcon from "@mui/icons-material/Code";

function About() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          mb: 4,
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: -40,
            background: (theme) =>
              `radial-gradient(800px 400px at -10% -10%, ${theme.palette.primary.light}22 0%, transparent 60%),
               radial-gradient(800px 400px at 110% 110%, ${theme.palette.secondary.light}22 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />

        <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", position: "relative" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, fontSize: 32, boxShadow: 3 }}>J</Avatar>
          <Typography variant="h3" fontWeight={800}>About Demo</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            A simple React + Vite app showcasing routing, protected pages, and modern Material UI components.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ pt: 1 }}>
            <Button variant="contained" onClick={() => navigate("/home")}>
              Get Started
            </Button>
            <Button variant="outlined" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
          </Stack>
        </Stack>
      </Box>
      
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 1, borderRadius: 2, display: "inline-flex" }}>
                  <RocketLaunchIcon />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Our Mission
                  </Typography>
                  <Typography color="text.secondary">
                    Build fast, accessible, and elegant UI with a clean architecture and a friendly developer experience.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ bgcolor: "secondary.main", color: "secondary.contrastText", p: 1, borderRadius: 2, display: "inline-flex" }}>
                  <CodeIcon />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Tech Stack
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                    React 19, React Router, Material UI 7, Vite.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip icon={<AutoStoriesIcon />} label="React 19" variant="outlined" />
                    <Chip label="Router v7" variant="outlined" />
                    <Chip label="MUI 7" variant="outlined" />
                    <Chip label="Vite" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">What you get</Typography>
                <Typography color="text.secondary">
                  Protected routes, a polished NavBar with a cart badge, responsive product grid with search and filters,
                  detailed product pages with related items, and a persistent shopping cart with totals.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
