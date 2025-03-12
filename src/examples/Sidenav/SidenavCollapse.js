// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function SidenavCollapse({ icon, name, active, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  return (
    <ListItem
      component="li"
      sx={{
        position: "relative",
        padding: 0,
        marginBottom: "-8px",
        marginTop: "42px",
      }}
    >
      {/* Curved white background for active state */}
      {active && (
        <MDBox
          sx={{
            position: "absolute",
            height: "170%",
            top: "-10px",
            width: "78%",
            right: "0",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
            backgroundColor: "#E0E0E0", // Light gray for active item
            zIndex: 0,
          }}
        />
      )}

      {/* Icon box - positioned outside the active background curve */}
      <ListItemIcon
        sx={(theme) => ({
          ...collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active }),
          minWidth: "42px",
          position: "relative",
          zIndex: 1,
          marginLeft: "16px",
          color: active ? "#FFFFFF" : "#FFFFFF",
          // Red when active, white otherwise
        })}
      >
        {typeof icon === "string" ? (
          <Icon sx={{ color: active ? "#FFFFFF" : "#FFFFFF", position: "absolute", top: "23px" }}>
            {icon}
          </Icon>
        ) : (
          icon
        )}
      </ListItemIcon>

      {/* Text content */}
      <MDBox
        {...rest}
        sx={(theme) => ({
          ...collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          }),
          position: "relative",
          zIndex: 1,
          background: "transparent",
          boxShadow: "none",
          width: "auto",
          padding: 0,
          margin: 0,
        })}
      >
        <ListItemText
          primary={name}
          sx={(theme) => ({
            ...collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            }),
            marginLeft: "0",
          })}
          primaryTypographyProps={{
            style: {
              color: active ? "#ED3237" : "#FFFFFF", // Red text when active, white otherwise
              fontWeight: active ? "500" : "400",
            },
          }}
        />
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
