import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon, title, route, light, isAdmin }) {
  const navigate = useNavigate();
  const routes = route.slice(0, -1);

  const handleHomeClick = (event) => {
    event.preventDefault();
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // Function to get the navigation path for a breadcrumb item
  const getNavigationPath = (currentRoute, index) => {
    // Handle "Admin" route specifically
    if (currentRoute.toLowerCase() === "admin") {
      return "/admin/dashboard";
    }
    if (currentRoute.toLowerCase() === "profile") {
      return "/admin/profile";
    }
    if (currentRoute.toLowerCase() === "userprofile") {
      return "/dashboard";
    }
    // Special case for profile-related routes
    if (currentRoute.toLowerCase() === "profiledetails") {
      return "/admin/profile";
    }

    // Build path based on route hierarchy
    const basePath = isAdmin ? "/admin" : "";
    const pathSegments = routes.slice(0, index + 1);
    return `${basePath}/${pathSegments.join("/").toLowerCase()}`;
  };

  // Handle click for breadcrumb items
  const handleBreadcrumbClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="#" onClick={handleHomeClick}>
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>

        {routes.map((el, index) => (
          <Link
            to="#"
            key={el}
            onClick={(e) => handleBreadcrumbClick(e, getNavigationPath(el, index))}
          >
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}

        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>

      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {title.replace("-", " ")}
      </MDTypography>
    </MDBox>
  );
}

Breadcrumbs.defaultProps = {
  light: false,
};

Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
  isAdmin: PropTypes.bool.isRequired,
};

export default Breadcrumbs;
