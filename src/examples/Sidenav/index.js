import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();

  let textColor = "white";
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

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
  const userRoutes = ["/dashboard"];

  // Filter routes based on the user role (Admin or Regular User)
  const filteredRoutes = routes.filter((route) => {
    if (isAdminRoute) {
      // Only show "Admin Dashboard" and "Profile" for admin users
      return adminRoutes.includes(route.route);
    } else {
      // Only show "Dashboard" for regular users
      return userRoutes.includes(route.route);
    }
  });

  // Render the filtered routes
  const renderRoutes = filteredRoutes.map(({ type, name, icon, noCollapse, key, href, route }) => {
    const isActive = location.pathname === route; // Check if the route matches the current path

    return (
      <NavLink key={key} to={route}>
        <SidenavCollapse name={name} icon={icon} active={isActive} />
        {/* Pass isActive to SidenavCollapse */}
      </NavLink>
    );
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
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

        {/* Logo for Swotle */}
        <MDBox
          component={NavLink}
          to="/"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MDBox component="img" src={swotleLogo} alt="Swotle Logo" width="7rem" />
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          ></MDBox>
        </MDBox>
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      {/* Render filtered routes */}
      <List>{renderRoutes}</List>
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
