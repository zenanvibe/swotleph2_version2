import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import bgImage from "assets/images/login.jpg";
import leftImage from "assets/images/signupbg.png";
import API from "../../../api/config";

function Cover() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sidebarElement = document.querySelector(".sidebar-container");
    if (sidebarElement) sidebarElement.style.display = "none";
    return () => {
      if (sidebarElement) sidebarElement.style.display = "block";
    };
  }, []);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleCloseAlert = () => setOpenAlert(false);

  const validateForm = () => {
    if (!name || !email || !password || !phone || !companyName) {
      setError("All fields are required");
      setOpenAlert(true);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setOpenAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    setLoading(true);

    const payload = { name, email, phone, password, company_name: companyName };

    try {
      const response = await fetch(`${API}auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) navigate("/sign-in");
      else {
        setError(data.message || "Registration failed. Please try again.");
        setOpenAlert(true);
      }
    } catch (error) {
      setError("Connection error. Please check your internet connection.");
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
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${leftImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Organization Name"
              fullWidth
              margin="normal"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
            />

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

          <Typography variant="body2" textAlign="center" mt={3}>
            Already have an account?{" "}
            <Link
              to="/sign-in"
              style={{ color: "red", textDecoration: "none", fontWeight: "bold" }}
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
