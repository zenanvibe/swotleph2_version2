import { useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom"; // ✅ useNavigate imported
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MDBox from "components/MDBox";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import swotleLogo from "assets/logo/output-onlinepngtools.png";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const navigate = useNavigate(); // ✅ Now navigate is defined
  const location = useLocation();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;

  // Get role from localStorage (or any other state management method)
  const role = localStorage.getItem("roles"); // ✅ Fix: Define role properly
  const isAdmin = role === "admin";

  // Always use white text color for the red background
  let textColor = "white";

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Determine if the current user is an admin based on the path
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Define route names for Admin and User
  const adminRoutes = ["/admin/dashboard", "/admin/profile"];
  const userRoutes = ["/dashboard", "/interviewcandidate", "/teammembers"];

  // Filter routes based on the user role (Admin or Regular User)
  const filteredRoutes = routes.filter((route) => {
    if (isAdminRoute) {
      return adminRoutes.includes(route.route);
    } else {
      return userRoutes.includes(route.route);
    }
  });

  // Render the filtered routes
  const renderRoutes = filteredRoutes.map(({ type, name, icon, noCollapse, key, href, route }) => {
    const isActive = location.pathname === route; // Check if the route matches the current path

    return (
      <NavLink key={key} to={route}>
        <SidenavCollapse name={name} icon={icon} active={isActive} />
      </NavLink>
    );
  });

  // Handle logout function
  const handleLogout = () => {
    // Clear user-related data
    localStorage.removeItem("company_id");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect based on role
    if (isAdmin) {
      navigate("/admin/sign-in"); // ✅ Navigate to admin sign-in page
    } else {
      navigate("/sign-in"); // ✅ Navigate to user sign-in page
    }
  };

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Top section with logo */}
        <MDBox pt={3} pb={1} px={4} textAlign="center">
          <MDBox
            display={{ xs: "block", xl: "none" }}
            position="absolute"
            top={0}
            right={0}
            p={1.625}
            onClick={closeSidenav}
            sx={{ cursor: "pointer" }}
          >
            {/* Close icon or button can be added here */}
          </MDBox>

          {/* Logo for Swotle - styled with white text for red background */}
          <MDBox
            component={NavLink}
            to="/"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MDBox
              component="img"
              src={swotleLogo}
              alt="Swotle Logo"
              width="7rem"
              sx={{ filter: "brightness(0) invert(1)" }} // Make the logo white
            />
            <MDBox
              width={!brandName && "100%"}
              sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            ></MDBox>
          </MDBox>
        </MDBox>

        <Divider
          light={true}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            margin: "0 16px",
          }}
        />

        {/* Main navigation links */}
        <MDBox sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>{renderRoutes}</List>
        </MDBox>

        {/* Logout section at bottom */}
        <MDBox
          px={2}
          mb={2}
          sx={{ paddingLeft: "40px", paddingRight: "64px", marginBottom: "46px" }}
        >
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: "#FFFFFF",
              padding: "8px 16px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemIcon sx={{ minWidth: "42px", color: "#FFFFFF" }}>
              <Icon>logout</Icon>
            </ListItemIcon>
            <ListItemText
              primary="Log out"
              primaryTypographyProps={{
                color: "inherit",
                fontSize: "0.875rem",
              }}
            />
          </ListItem>
        </MDBox>
      </MDBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
