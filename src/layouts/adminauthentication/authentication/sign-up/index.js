import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import bgImage from "assets/images/login.jpg";
import leftImage from "assets/images/signupbg.png";

function Cover() {
  // Hide navbar when component mounts
  useEffect(() => {
    // This targets the navbar element - adjust the selector as needed for your app
    const navbarElement = document.querySelector(".navbar-container"); // Adjust selector as needed
    if (navbarElement) {
      navbarElement.style.display = "none";
    }

    // Show navbar again when navigating away
    return () => {
      if (navbarElement) {
        navbarElement.style.display = "block";
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw", // Take full width
        position: "fixed", // Position fixed to overlay the entire viewport
        top: 0,
        left: 0,
        zIndex: 1200, // Higher z-index to appear above sidebar
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Side Background Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${leftImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Signup Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: { xs: "none", md: `url(${bgImage})` },
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ width: "90%", maxWidth: 400, p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="crimson"
            textAlign="center"
            gutterBottom
          >
            Create an Account to Get Started
          </Typography>

          <Typography variant="body2" textAlign="center" color="textSecondary" mb={3}>
            Just Enter Email and Password
          </Typography>

          <Box component="form">
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Centered Sign-Up Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  bgcolor: "crimson",
                  color: "white !important",
                  "&:hover": { bgcolor: "darkred" },
                  px: 4,
                }}
              >
                SIGN UP
              </Button>
            </Box>
          </Box>

          {/* Bold Red Sign-In Text */}
          <Typography variant="body2" textAlign="center" mt={3}>
            Already have an account?{" "}
            <Link
              to="/admin/sign-in"
              style={{
                color: "red",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Cover;
