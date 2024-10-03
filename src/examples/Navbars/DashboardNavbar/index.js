import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";

function DashboardNavbar({ absolute, light, isMini, role }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const route = location.pathname.split("/").slice(1);
  const isAdmin = role === "admin";

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Logic to handle logout based on the user's role
  const handleLogout = () => {
    // Clear user-related data (if needed, such as tokens, localStorage)
    localStorage.removeItem("company_id");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Conditional navigation based on role
    if (isAdmin) {
      navigate("/admin/sign-in"); // Navigate to admin sign-in page
    } else {
      navigate("/sign-in"); // Navigate to user sign-in page
    }
  };

  // Logic to determine the breadcrumb title based on the current route
  const getBreadcrumbTitle = () => {
    if (isAdmin) {
      if (location.pathname === "/admin/profile") {
        return "Profile"; // Show "Profile" when on /admin/profile
      }
      return "Admin Dashboard"; // Default title for other admin pages
    }
    return "Dashboard"; // Default title for non-admin users
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* Breadcrumbs based on route and role */}
          <Breadcrumbs
            icon="home"
            title={getBreadcrumbTitle()} // Dynamically sets the title
            route={route}
            light={light}
            isAdmin={isAdmin} // Pass isAdmin to Breadcrumbs
          />
        </MDBox>

        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton sx={navbarIconButton} size="small" disableRipple onClick={handleOpenMenu}>
                <Icon sx={{ color: light ? "white" : "dark" }}>account_circle</Icon>
              </IconButton>

              <Menu
                anchorEl={openMenu}
                open={Boolean(openMenu)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={{ color: light ? "white" : "dark" }} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  role: PropTypes.string.isRequired, // Ensure role is passed as a prop
};

export default DashboardNavbar;
