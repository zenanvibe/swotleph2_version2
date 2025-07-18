import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "assets/images/login.jpg";
import leftImage from "assets/images/loginbg.jpg";
import API from "api/config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");

  useEffect(() => {
    if (success) setOpenSnackbar(true);
  }, [success]);

  const handleTogglePassword = () => setShowPassword((v) => !v);
  const handleToggleConfirm = () => setShowConfirm((v) => !v);
  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API}auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Password reset successful! Redirecting to sign in...");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
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

      {/* Reset Password Section */}
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
          Reset Password
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
          Enter your new password below
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", maxWidth: "350px", textAlign: "center" }}
        >
          <TextField
            label="New Password"
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
            disabled={loading}
          />
          <TextField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "red" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirm} edge="end" sx={{ p: 0.5 }}>
                    {showConfirm ? (
                      <Visibility sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1, fontSize: "13px" }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: "crimson", color: "white !important", fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Reset Password"}
          </Button>
        </Box>
        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%", fontFamily: "Kamerion, sans-serif" }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
