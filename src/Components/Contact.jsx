import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const isNameValid = formData.name.trim() !== "";
    const isEmailPresent = formData.email.trim() !== "";
    const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);

    if (!isNameValid || !isEmailPresent || !isEmailValid) {
      return;
    }

    alert("✅ Thank you for contacting us! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setSubmitted(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Get in Touch
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        We’d love to hear from you. Reach out through the form or our contact details.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 3, bgcolor: "primary.main", color: "white" }}
          >
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Stack spacing={3} mt={2}>
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 2 }} /> contact@demo.net
              </Box>
              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 2 }} /> +91 98765 43210
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 2 }} /> 123, AaBbCc Street, Coimbatore
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Send Us a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={submitted && formData.name.trim() === ""}
                    helperText={submitted && formData.name.trim() === "" ? "Name is required" : ""}
                  />

                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={submitted && (formData.email.trim() === "" || !/\S+@\S+\.\S+/.test(formData.email))}
                    helperText={
                      submitted && formData.email.trim() === ""
                        ? "Email is required"
                        : submitted && !/\S+@\S+\.\S+/.test(formData.email)
                        ? "Enter a valid email"
                        : ""
                    }
                  />
                  <TextField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2, py: 1.2, fontSize: "1rem" }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
