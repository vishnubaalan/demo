import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeItem, clear, totals } = useCart();
  const navigate = useNavigate();

  const tax = totals.subtotal * 0.1;
  const grand = totals.subtotal + tax;

  return (
    <Container sx={{ pt: 3, pb: 5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="subtitle2" color="text.secondary">
          Back
        </Typography>
      </Stack>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Your Cart
      </Typography>

      {items.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate("/home")}>
              Browse products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2} divider={<Divider flexItem />}>
                {items.map((i) => (
                  <Stack
                    key={i.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        bgcolor: "#f5f5f5",
                        overflow: "hidden",
                      }}
                    >
                      {i.thumbnail ? (
                        <img
                          src={i.thumbnail}
                          alt={i.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                        noWrap
                      >
                        {i.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{Number(i.price).toLocaleString()}
                      </Typography>
                    </Box>
                    <TextField
                      type="number"
                      size="small"
                      value={i.quantity}
                      onChange={(e) => updateQty(i.id, Number(e.target.value))}
                      inputProps={{
                        min: 1,
                        max: i.stock || 99,
                        style: { width: 72 },
                      }}
                    />
                    <Typography
                      sx={{ width: 110, textAlign: "right", fontWeight: 600 }}
                    >
                      ₹{(Number(i.price) * Number(i.quantity)).toLocaleString()}
                    </Typography>
                    <IconButton color="error" onClick={() => removeItem(i.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2 }}
              >
                <Button color="error" onClick={clear}>
                  Clear cart
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ width: { xs: "100%", md: 360 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order summary
              </Typography>
              <Stack spacing={1}>
                <Row
                  label={`Items (${totals.count})`}
                  value={`₹${totals.subtotal.toLocaleString()}`}
                />
                <Row label="Tax (10%)" value={`₹${tax.toLocaleString()}`} />
                <Divider />
                <Row
                  label="Total"
                  value={`₹${grand.toLocaleString()}`}
                  strong
                />
              </Stack>
              <Button
                fullWidth
                sx={{ mt: 2 }}
                size="large"
                variant="contained"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => alert("This is a demo checkout.")}
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
}

function Row({ label, value, strong }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: strong ? 700 : 500 }}>{value}</Typography>
    </Stack>
  );
}
