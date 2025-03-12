/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, whiteSidenav, darkMode } = ownerState;

  const { white, transparent, grey } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba } = functions;

  return {
    background: active
      ? "rgba(255, 255, 255, 0.2)" // Semi-transparent white for active items
      : transparent.main,
    color: white.main, // Always white text for better visibility on red background
    display: "flex",
    alignItems: "center",
    width: "87%", // Slightly narrower than 100% to allow space for the curve
    padding: `${pxToRem(8)} ${pxToRem(10)}`,
    margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
    borderRadius: "30px", // Increased border radius for more pronounced curve
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active ? md : "none",
    backgroundColor: active ? "#E0E0E0" : "transparent", // Light gray background for active items
    [breakpoints.up("xl")]: {
      transition: transitions.create(["box-shadow", "background-color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },

    "&:hover, &:focus": {
      backgroundColor: active ? "#E0E0E0" : "rgba(255, 255, 255, 0.1)", // Keep active color or add hover effect
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { active } = ownerState;

  const { white, dark } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color: active ? dark.main : white.main, // Dark color for active state, white otherwise
    borderRadius: borderRadius.md,
    display: "grid",
    placeItems: "center",
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "& svg, svg g": {
      color: active ? dark.main : white.main, // Dark icon for active state, white otherwise
    },
  };
}

const collapseIcon = ({ palette: { white, dark } }, { active }) => ({
  color: active ? dark.main : white.main, // Dark icon for active state, white otherwise
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions, palette } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightRegular, fontWeightMedium } = typography;
  const { pxToRem } = functions;
  const { dark } = palette;

  return {
    marginLeft: pxToRem(10),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightRegular,
      fontSize: size.sm,
      lineHeight: 0,
      color: active ? dark.main : "#FFFFFF", // Dark text for active state, white otherwise
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
