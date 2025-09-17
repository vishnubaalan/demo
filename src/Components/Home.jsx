import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Button,
  TextField,
  Box,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Rating,
  Pagination,
  CardActionArea,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const fallbackImage =
  "https://dummyimage.com/300x225/cccccc/000000&text=No+Image";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [order, setOrder] = useState("asc");
  const [limit, setLimit] = useState(30);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [priceBounds, setPriceBounds] = useState([0, 0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [snackOpen, setSnackOpen] = useState(false);

  const computeMeta = (list) => {
    const prices = list.map((p) => Number(p.price) || 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    setPriceBounds([minPrice, maxPrice]);
    setPriceRange([minPrice, maxPrice]);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let apiSortBy;
      let apiOrder = order;
      if (sortBy === "priceLowHigh") {
        apiSortBy = "price";
        apiOrder = "asc";
      } else if (sortBy === "priceHighLow") {
        apiSortBy = "price";
        apiOrder = "desc";
      } else if (sortBy === "rating") {
        apiSortBy = "rating";
        apiOrder = "desc";
      } else if (sortBy === "discount") {
        apiSortBy = "discountPercentage";
        apiOrder = "desc";
      }

      const baseUrl = selectedCategory
        ? `https://dummyjson.com/products/category/${encodeURIComponent(
            selectedCategory
          )}`
        : "https://dummyjson.com/products";

      const params = { limit, skip };
      if (apiSortBy) {
        params.sortBy = apiSortBy;
        params.order = apiOrder;
      }

      const res = await axios.get(baseUrl, { params, withCredentials: false });
      const data = res.data;
      setProducts(data.products || []);
      if (typeof data.total === "number") setTotal(data.total);
      computeMeta(data.products || []);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, order, limit, skip]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        const apiCats = Array.isArray(res.data) ? res.data : [];
        const normalized = apiCats
          .map((c) => {
            if (typeof c === "string") return { value: c, label: c };
            if (c && typeof c === "object") {
              const value = c.slug || c.name || "" + JSON.stringify(c);
              const label = c.name || c.slug || String(value);
              return { value, label };
            }
            return null;
          })
          .filter(Boolean);
        setCategories(normalized);
      } catch {
        console.error("Failed to fetch categories");
      }
    })();
  }, []);

  const searchProducts = useCallback(
    async (query) => {
      try {
        let apiSortBy;
        let apiOrder = order;
        if (sortBy === "priceLowHigh") {
          apiSortBy = "price";
          apiOrder = "asc";
        } else if (sortBy === "priceHighLow") {
          apiSortBy = "price";
          apiOrder = "desc";
        } else if (sortBy === "rating") {
          apiSortBy = "rating";
          apiOrder = "desc";
        } else if (sortBy === "discount") {
          apiSortBy = "discountPercentage";
          apiOrder = "desc";
        }

        const params = { q: query, limit, skip };
        if (apiSortBy) {
          params.sortBy = apiSortBy;
          params.order = apiOrder;
        }

        const res = await axios.get(`https://dummyjson.com/products/search`, {
          params,
          withCredentials: false,
        });
        const data = res.data;
        setProducts(data.products || []);
        if (typeof data.total === "number") setTotal(data.total);
        computeMeta(data.products || []);
      } catch {
        console.error("Failed to search products");
      } finally {
      }
    },
    [order, sortBy, limit, skip]
  );

  useEffect(() => {
    const trimmed = (search || "").trim();
    if (trimmed.length === 0) {
      fetchProducts();
    } else {
      searchProducts(trimmed);
    }
  }, [search, searchProducts, fetchProducts]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchProducts(search);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("relevance");
    setOrder("asc");
    setLimit(30);
    setSkip(0);
    setPriceRange(priceBounds);
    fetchProducts();
  };

  const handleAddProduct = async (values, { resetForm, setSubmitting }) => {
    try {
      const res = await axios.post(
        "https://dummyjson.com/products/add",
        { title: values.addTitle },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = res.data;
      resetForm();
      const newProduct = {
        ...data,
        id: data.id || Date.now(),
        thumbnail: data.thumbnail || fallbackImage,
        price: Number(data.price) || 0,
        rating: Number(data.rating) || 0,
        discountPercentage: Number(data.discountPercentage) || 0,
        brand: data.brand || "",
        category: data.category || "",
        title: data.title,
      };
      setProducts((prev) => [newProduct, ...prev]);
      computeMeta([newProduct, ...products]);
    } catch {
      console.error("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditId(product.id);
  };

  const handleUpdateProduct = async (values, { setSubmitting }) => {
    setEditLoading(true);
    try {
      await axios.put(
        `https://dummyjson.com/products/${editId}`,
        { title: values.editTitle },
        { headers: { "Content-Type": "application/json" } }
      );
      setEditId(null);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, title: values.editTitle } : p
        )
      );
    } catch {
      console.error("Failed to update product");
    } finally {
      setEditLoading(false);
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      computeMeta(products.filter((p) => p.id !== id));
    } catch {
      console.error("Failed to delete product");
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setSnackOpen(true);
  };

  const displayedProducts = useMemo(() => {
    let list = [...products];

    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    return list;
  }, [products, priceRange]);

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

  const formatPrice = (price) => `₹${Number(price).toLocaleString()}`;

  return (
    <Container sx={{ pt: 3, pb: 5, px: { xs: 1, sm: 3 }, maxWidth: "lg" }}>
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HomeRoundedIcon fontSize="large" />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Products
        </Typography>
      </Box> */}

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ flex: "0 1 auto" }}
          >
            <TextField
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: 220 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {search ? (
                      <IconButton size="small" onClick={() => setSearch("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Formik
            initialValues={{ addTitle: "" }}
            validationSchema={Yup.object({
              addTitle: Yup.string().required("Required"),
            })}
            onSubmit={handleAddProduct}
          >
            {({ isSubmitting, errors, touched, handleChange, values }) => (
              <Form style={{ width: "auto", flex: "0 1 auto" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    name="addTitle"
                    placeholder="New product"
                    value={values.addTitle}
                    onChange={handleChange}
                    size="small"
                    error={touched.addTitle && Boolean(errors.addTitle)}
                    helperText={
                      touched.addTitle && errors.addTitle
                        ? errors.addTitle
                        : " "
                    }
                    sx={{ width: 200 }}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: 72, top: -11 }}
                  >
                    Add
                  </Button>

                  {isSubmitting && (
                    <Box
                      sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                      }}
                    >
                      <CircularProgress size={80} />
                    </Box>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          alignItems: { md: "flex-start" },
          gap: { xs: 0, md: 3 },
        }}
      >
        <Drawer
          anchor="right"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        >
          <Box sx={{ width: 320, p: 2 }} role="presentation">
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Filters
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                fullWidth
                sx={{ marginTop: "4px", display: "flex" }}
              >
                <InputLabel id="sortby-label">Sort by</InputLabel>
                <Select
                  labelId="sortby-label"
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Customer Rating</MenuItem>
                  <MenuItem value="discount">Discount</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleReset}>
                Reset filters
              </Button>
              <Button variant="contained" onClick={() => setFilterOpen(false)}>
                Apply
              </Button>
            </Box>
          </Box>
        </Drawer>

        <Box sx={{ flex: "1 1 auto", width: "100%", order: { md: 1 } }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              Showing {displayedProducts.length} of {total || products.length}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="top-sortby-label">Sort by</InputLabel>
                <Select
                  labelId="top-sortby-label"
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Customer Rating</MenuItem>
                  <MenuItem value="discount">Discount</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={order}
                onChange={(_, v) => v && setOrder(v)}
                aria-label="order"
              >
                <ToggleButton value="asc" aria-label="asc">
                  Asc
                </ToggleButton>
                <ToggleButton value="desc" aria-label="desc">
                  Desc
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFilterOpen(true)}
              >
                Filters
              </Button>
            </Box>
          </Box>

          {displayedProducts.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Button variant="outlined" onClick={handleReset}>
                Reset filters
              </Button>
            </Box>
          ) : null}

          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {displayedProducts.map((product) => {
              const price = Number(product.price) || 0;
              const discount = Number(product.discountPercentage) || 0;
              const original = discount
                ? Math.round(price / (1 - discount / 100))
                : price;

              return (
                <Card
                  key={product.id}
                  sx={{
                    width: "100%",
                    transition: "0.25s",
                    "&:hover": { boxShadow: 6 },
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 360,
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Box
                      sx={{
                        position: "relative ",
                        width: "50%",
                        pt: "50%",
                        mx: "auto",
                        overflow: "hidden",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <img
                        src={product.thumbnail || fallbackImage}
                        alt={product.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImage;
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </CardActionArea>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {editId === product.id ? (
                      <Formik
                        initialValues={{ editTitle: product.title }}
                        validationSchema={Yup.object({
                          editTitle: Yup.string().required("Required"),
                        })}
                        onSubmit={handleUpdateProduct}
                        enableReinitialize
                      >
                        {({
                          isSubmitting,
                          errors,
                          touched,
                          handleChange,
                          values,
                        }) => (
                          <Form>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <TextField
                                name="editTitle"
                                value={values.editTitle}
                                onChange={handleChange}
                                size="small"
                                error={
                                  touched.editTitle && Boolean(errors.editTitle)
                                }
                                helperText={
                                  touched.editTitle && errors.editTitle
                                }
                                sx={{ flex: 1 }}
                                fullWidth
                              />
                              <Button
                                disabled={isSubmitting || editLoading}
                                type="submit"
                                color="primary"
                                size="small"
                                variant="contained"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setEditId(null)}
                                size="small"
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">
                          {product.brand}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                          noWrap
                        >
                          {product.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <Rating
                            name="read-only"
                            value={Number(product.rating) || 0}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                          <Typography variant="caption" color="text.secondary">
                            {Number(product.rating || 0).toFixed(1)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 1,
                            mt: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {formatPrice(price)}
                          </Typography>
                          {discount > 0 && (
                            <>
                              <Typography
                                variant="body2"
                                color="text.disabled"
                                sx={{ textDecoration: "line-through" }}
                              >
                                {formatPrice(original)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="success.main"
                                sx={{ fontWeight: 600 }}
                              >
                                {discount}% off
                              </Typography>
                            </>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mt: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="Add to cart">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to cart
                            </Button>
                          </Tooltip>
                          <Button
                            title="View"
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            View
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mt: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="Edit product">
                            <IconButton
                              size="small"
                              onClick={() => handleEditProduct(product)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete product">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          color="primary"
          count={Math.max(1, Math.ceil((total || products.length) / limit))}
          page={Math.floor(skip / limit) + 1}
          onChange={(_, p) => setSkip((p - 1) * limit)}
        />
      </Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Added to cart
        </Alert>
      </Snackbar>
    </Container>
  );
}
