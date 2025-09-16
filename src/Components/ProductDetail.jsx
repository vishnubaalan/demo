import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Button,
  Box,
  Grid,
  Stack,
  Divider,
  Rating,
  Chip,
  IconButton,
  Modal,
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon, 
  ShoppingCartOutlined as ShoppingCartOutlinedIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from "@mui/icons-material";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [editValues, setEditValues] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!isMounted) return;
        const p = res.data;
        setProduct(p);
        setActiveImageIndex(0);
        setEditValues({
          title: p.title,
          price: p.price,
          description: p.description,
        });
        return axios.get(
          `https://dummyjson.com/products/category/${encodeURIComponent(
            p.category
          )}`,
          { params: { limit: 8 } }
        );
      })
      .then((relRes) => {
        if (!relRes || !isMounted) return;
        const list = (relRes.data?.products || []).filter(
          (p) => String(p.id) !== String(id)
        );
        setRelatedProducts(list);
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdate = () => {
    axios
      .put(`https://dummyjson.com/products/${id}`, {
        title: editValues.title,
        price: editValues.price,
        description: editValues.description,
      })
      .then((res) => {
        setProduct(res.data);
        alert("Product updated successfully!");
        handleCloseModal();
      })
      .catch((err) => console.error(err));
  };

  if (!product)
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

  return (
    <>
      <Container
        sx={{ mt: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 }, maxWidth: "lg" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="subtitle2" color="text.secondary">
            Back
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  pt: "75%",
                  backgroundColor: "#f7f7f7",
                  borderRadius: 1,
                }}
              >
                <img
                  src={product.images?.[activeImageIndex] || product.thumbnail}
                  alt={product.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: 8,
                  }}
                />
              </Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, overflowX: "auto" }}
              >
                {(product.images || [product.thumbnail]).map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    sx={{
                      border: idx === activeImageIndex ? 2 : 1,
                      borderColor:
                        idx === activeImageIndex ? "primary.main" : "divider",
                      borderRadius: 1,
                      p: 0.5,
                      cursor: "pointer",
                      minWidth: 64,
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      style={{ width: 64, height: 64, objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {product.title}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1 }}
              >
                <Rating
                  value={Number(product.rating) || 0}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {Number(product.rating || 0).toFixed(1)}
                </Typography>
                <Chip size="small" label={product.brand} />
                <Chip
                  size="small"
                  label={product.category}
                  variant="outlined"
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                ${Number(product.price).toLocaleString()}
              </Typography>
              {product.discountPercentage ? (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ mt: 0.5 }}
                >
                  Save {product.discountPercentage}% today
                </Typography>
              ) : null}
              <Typography variant="body1" sx={{ mt: 2 }}>
                {product.description}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartOutlinedIcon />}
                >
                  Add to cart
                </Button>

                <Box sx={{ mt: 6 }}>
                  <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Update Product
                  </Button>
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FavoriteBorderIcon />}
                >
                  Wishlist
                </Button>
              
              
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Related products
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map((p) => (
              <Grid key={p.id} item xs={12} sm={6} md={3}>
                <Card
                  onClick={() => navigate(`/product/${p.id}`)}
                  sx={{ cursor: "pointer", height: "100%" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      pt: "75%",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: 8,
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      noWrap
                    >
                      {p.brand}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                      noWrap
                    >
                      {p.title}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      <Rating
                        value={Number(p.rating) || 0}
                        readOnly
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Number(p.rating || 0).toFixed(1)}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
                      ${Number(p.price).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="update-product-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography id="update-product-title" variant="h6" gutterBottom>
              Update Product
            </Typography>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={editValues.title}
              onChange={(e) =>
                setEditValues({ ...editValues, title: e.target.value })
              }
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              value={editValues.price}
              onChange={(e) =>
                setEditValues({ ...editValues, price: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={editValues.description}
              onChange={(e) =>
                setEditValues({ ...editValues, description: e.target.value })
              }
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              color="primary"
              onClick={handleUpdate}
              fullWidth
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
}

export default ProductDetail;
