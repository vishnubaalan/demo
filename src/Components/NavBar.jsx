import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Menu as MenuIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function NavBar(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { totals } = useCart();

  const location = useLocation();
  const isActive = React.useCallback(
    (path) => {
      if (path === "/home") return location.pathname === "/home";
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNav = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); 
    localStorage.removeItem("userEmail");
    navigate("/"); 
    };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const userEmail = localStorage.getItem("userEmail") || "vishnu@gmail.com";




  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ my: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <HomeRoundedIcon />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.12em" }}>
          PRODUCTS
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={
                isActive(item.path)
                  ? { textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1, mx: 1, '&:hover': { bgcolor: 'primary.dark' } }
                  : { textAlign: 'center', '&:hover': { color: 'primary.main' } }
              }
              onClick={() => handleNav(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            sx={
              isActive('/cart')
                ? { textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1, mx: 1, '&:hover': { bgcolor: 'primary.dark' } }
                : { textAlign: 'center', '&:hover': { color: 'primary.main' } }
            }
            onClick={() => handleNav('/cart')}
          >
            <ListItemText primary={`Cart (${totals.count})`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }} onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="fixed" color="default" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            onClick={() => navigate("/home")}
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <HomeRoundedIcon fontSize="large" />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              Products
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={isActive(item.path) ? 'contained' : 'text'}
                color={isActive(item.path) ? 'primary' : 'inherit'}
                sx={
                  isActive(item.path)
                    ? { color: 'primary.contrastText' }
                    : { '&:hover': { color: 'primary.main', backgroundColor: 'transparent' } }
                }
                onClick={() => handleNav(item.path)}
              >
                {item.label}
              </Button>
            ))}
            <Tooltip title="Cart">
              <IconButton
                color="inherit"
                sx={
                  isActive('/cart')
                    ? { bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }
                    : { '&:hover': { color: 'primary.main' } }
                }
                onClick={() => handleNav('/cart')}
              >
                <Badge badgeContent={totals.count} color="secondary" max={99}>
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton color="inherit" onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem >{userEmail}</MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); handleLogout(); }}>Logout</MenuItem>
      </Menu>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;
