import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import bgImage from "assets/images/login.jpg";
import leftImage from "assets/images/signupbg.png";
import API from "../../../../api/config"; // Adjust the path as needed

function Cover() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      setError("Name is required");
      setOpenAlert(true);
      return false;
    }

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

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setOpenAlert(true);
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate inputs before making API call
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: "admin",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from API or a default message
        setError(data.message || "Registration failed. Please try again.");
        setOpenAlert(true);
        setLoading(false);
        return;
      }

      // Navigate to sign-in page after successful registration
      navigate("/admin/sign-in");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Network error. Please try again later.");
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

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

          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              type={showPassword ? "text" : "password"}
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" sx={{ p: 0.5 }}>
                      {showPassword ? (
                        <Visibility sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "SIGN UP"}
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
