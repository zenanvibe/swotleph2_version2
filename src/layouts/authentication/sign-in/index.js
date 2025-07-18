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
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "assets/images/login.jpg";
import leftImage from "assets/images/loginbg.jpg";
import API from "../../../api/config";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Forgot password mode
  const [mode, setMode] = useState("sign-in"); // "sign-in" | "forgot"
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [openForgotSnackbar, setOpenForgotSnackbar] = useState(false);

  useEffect(() => {
    const sidebarElement = document.querySelector(".sidebar-container");
    if (sidebarElement) {
      sidebarElement.style.display = "none";
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.style.display = "block";
      }
    };
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleForgotOpen = () => {
    setMode("forgot");
    setForgotEmail(email); // Prefill with sign-in email
    setForgotSuccess("");
    setForgotError("");
  };
  const handleForgotClose = () => {
    setMode("sign-in");
    setForgotEmail("");
    setForgotSuccess("");
    setForgotError("");
  };
  const handleForgotSnackbarClose = () => setOpenForgotSnackbar(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotSuccess("");
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch(`${API}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setForgotSuccess("Reset link sent! Please check your email.");
        setOpenForgotSnackbar(true);
        setTimeout(() => {
          setMode("sign-in");
          setForgotEmail("");
          setForgotSuccess("");
          setForgotError("");
        }, 1000);
      } else {
        setForgotError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setForgotError("Network error. Please try again later.");
    } finally {
      setForgotLoading(false);
    }
  };

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      setOpenAlert(true);
      return false;
    }

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

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    const payload = { email, password, role: "company" };

    try {
      const response = await fetch(`${API}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        localStorage.setItem("company_id", data.company_id);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
        setOpenAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
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
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%", fontFamily: "Kamerion, sans-serif" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Left Image Section - Hidden on Mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: `url(${leftImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Login Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: { xs: 4, md: 0 },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "Playfair Display, serif",
            fontSize: { xs: "28px", md: "46px" },
            fontWeight: "bold",
            color: "#D32F2F",
            textAlign: "center",
            mb: 0,
          }}
        >
          Welcome
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            fontFamily: "Kamerion, sans-serif",
            textAlign: "center",
            fontSize: { xs: "12px", md: "14px" },
            mb: 2,
          }}
        >
          {mode === "sign-in" ? "Login via Email" : "Forgot Password"}
        </Typography>

        {/* Main Form Area */}
        {mode === "sign-in" ? (
          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ width: "100%", maxWidth: "350px", textAlign: "center" }}
          >
            {/* Email Field */}
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

            {/* Password Field with Toggle Icon */}
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

            {/* Remember Me and Forgot Password */}
            <Box display="flex" alignItems="center" justifyContent="space-between" my={1}>
              <Box display="flex" alignItems="center">
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
                  }}
                >
                  Remember me
                </Typography>
              </Box>
              <Button
                variant="text"
                size="small"
                sx={{ color: "#D32F2F", textTransform: "none", fontSize: "12px", fontWeight: 600 }}
                onClick={handleForgotOpen}
                disabled={loading}
              >
                Forgot Password?
              </Button>
            </Box>

            {/* Login Button */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                width: "50%",
                mt: 2,
                bgcolor: "crimson",
                color: "white !important",
                fontWeight: "600",
                "&:hover": { bgcolor: "#B71C1C" },
                py: { xs: 1.2, md: 1.5 },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "LOGIN"}
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleForgotSubmit}
            sx={{ width: "100%", maxWidth: "350px", textAlign: "center" }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "red" }} />
                  </InputAdornment>
                ),
              }}
              disabled={forgotLoading}
            />
            {forgotError && (
              <Alert severity="error" sx={{ mt: 1, fontSize: "13px" }}>
                {forgotError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "crimson", color: "white !important", fontWeight: 600 }}
              disabled={forgotLoading}
            >
              {forgotLoading ? (
                <CircularProgress size={22} sx={{ color: "white" }} />
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, color: "#D32F2F", textTransform: "none", fontWeight: 600 }}
              onClick={handleForgotClose}
              disabled={forgotLoading}
            >
              Back to Sign In
            </Button>
          </Box>
        )}

        {/* Sign Up Link */}
        {mode === "sign-in" && (
          <Typography
            variant="body2"
            mt={3}
            sx={{
              fontFamily: "Kamerion, sans-serif",
              textAlign: "center",
              fontSize: { xs: "12px", md: "14px" },
            }}
          >
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" style={{ color: "red", textDecoration: "none" }}>
              Sign Up
            </Link>
          </Typography>
        )}

        {/* Forgot Password Success Snackbar */}
        <Snackbar
          open={openForgotSnackbar}
          autoHideDuration={4000}
          onClose={handleForgotSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleForgotSnackbarClose}
            severity="success"
            sx={{ width: "100%", fontFamily: "Kamerion, sans-serif" }}
          >
            {forgotSuccess}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Basic;
