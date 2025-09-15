import React from "react";
import { Container, Grid, Typography, Card, CardContent, Avatar, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Stack spacing={2} alignItems="center" sx={{ textAlign: "center" }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 72, height: 72, fontSize: 28 }}>J</Avatar>
        <Typography variant="h3" fontWeight="bold">About Demo</Typography>
        <Typography color="text.secondary">
          A simple React + Vite app showcasing routing, protected pages, and MUI components.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mt: 2 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Our Mission
              </Typography>
              <Typography color="text.secondary">
                Build fast, accessible UI with a clean architecture and friendly developer experience.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tech Stack
              </Typography>
              <Typography color="text.secondary">
                React 19, React Router, Material UI, Vite. Deployed as a static site.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/home")}>Get Started</Button>
        <Button variant="outlined" onClick={() => navigate("/contact")}>Contact Us</Button>
      </Stack>
    </Container>
  );
}

export default About;
