import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Checkbox,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import backgroundImage from "assets/images/login.jpg";
import leftImage from "assets/images/loginbg.jpg";
import API from "../../../../api/config";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(""); // Store email input
  const [password, setPassword] = useState(""); // Store password input
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      setOpenAlert(true);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setOpenAlert(true);
      return false;
    }

    if (!password) {
      setError("Password is required");
      setOpenAlert(true);
      return false;
    }

    return true;
  };

  // Sign-in handler with API call using fetch
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Validate inputs before making API call
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(`${API}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          roles: "admin",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from API or a default message
        setError("Authentication failed. Please check your credentials.");
        setOpenAlert(true);
        return;
      }

      // Store the response values in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      // Set the roles in localStorage to the admin's user id from the API response if role is admin
      if (data.role === "admin") {
        localStorage.setItem("roles", data.userId); // Set to the user's ID if role is 'admin'
      }
      localStorage.setItem("company_id", data.company_id);

      // Navigate to the dashboard after successful sign-in
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setError("Network error. Please try again later.");
      setOpenAlert(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        width: "100vw", // Take full viewport width
        position: "fixed", // Fixed position to cover everything
        top: 0,
        left: 0,
        zIndex: 1200, // Higher z-index to appear above navbar
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%", fontFamily: "Kamerion, sans-serif" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: `url(${leftImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: { xs: 3, md: 0 },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Playfair Display, serif",
            fontSize: { xs: "32px", md: "46px" },
            fontWeight: "bold",
            color: "#D32F2F",
            textAlign: "center",
            mb: 0, // Reduced margin-bottom to decrease gap
          }}
        >
          Welcome
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontFamily: "Kamerion, sans-serif", textAlign: "center", fontSize: "14px", mb: 2 }} // Reduced font size
        >
          Login via Email
        </Typography>

        <Box
          component="form"
          onSubmit={handleSignIn}
          sx={{ width: "90%", maxWidth: "350px", textAlign: "center" }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "red" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" alignItems="center" justifyContent="start" my={1}>
            <Checkbox
              sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
              checked={rememberMe}
              onChange={handleSetRememberMe}
            />
            <Typography
              variant="body2"
              onClick={handleSetRememberMe}
              sx={{
                cursor: "pointer",
                fontFamily: "Kamerion, sans-serif",
                color: "black",
                fontSize: "12px",
              }} // Decreased font size
            >
              Remember me
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              width: "50%",
              mt: 2,
              bgcolor: "crimson",
              color: "white !important", // Ensured white text color
              fontWeight: "600",
              "&:hover": { bgcolor: "#B71C1C" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            LOGIN
          </Button>
        </Box>

        <Typography
          variant="body2"
          mt={3}
          sx={{ fontFamily: "Kamerion, sans-serif", textAlign: "center" }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/admin/sign-up" style={{ color: "red", textDecoration: "none" }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Basic;
