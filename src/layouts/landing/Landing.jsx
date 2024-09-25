import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import "./Landing.css";
import headerIllustration from "../../assets/landing/header-illustration-light.png";
import heroMediaIllustration from "../../assets/landing/hero-media-illustration-light.png";
import heroMediaImage from "../../assets/landing/logotype.png";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container>
        <Box
          sx={{
            zIndex: 2,
            maxWidth: "600px",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              color: "#1a202c",
            }}
          >
            Welcome to Swotle <br />
            Discover Your Team Through Graphology
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#718096",
              marginBottom: 3,
            }}
          >
            Unlock deeper insights into your team’s personality and performance.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6366F1",
              color: "#fff",
              padding: "12px 32px",
              "&:hover": {
                backgroundColor: "#4F46E5",
              },
            }}
            onClick={handleSignUp}
          >
            Sign Up Today and Transform the Way You Work!
          </Button>
        </Box>
      </Container>

      {/* Hero Media Section */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <img
          src={headerIllustration}
          alt="Header illustration"
          style={{
            position: "absolute",
            top: "0%",
            left: "5%",
            width: "90%",
            animation: "fadeIn 1s both cubic-bezier(0.3, 0, 0.2, 1)",
            willChange: "transform",
          }}
        />
        <img
          src={heroMediaIllustration}
          alt="Hero media illustration"
          style={{
            position: "absolute",
            top: "15%",
            right: "5%",
            width: "45%",
            animation: "fadeInLeftIllustration 3s 0.2s both cubic-bezier(0.3, 0, 0.2, 1)", // Slowed down to 2s
            willChange: "transform",
          }}
        />
        <img
          src={heroMediaImage}
          alt="Hero media"
          style={{
            position: "absolute",
            bottom: "0",
            right: "17%",
            top: "25%",
            width: "30%",
            animation: "fadeInLeftMedia 3s 0.2s both cubic-bezier(0.3, 0, 0.2, 1)", // Slowed down to 2s
            willChange: "transform",
            transform:
              "perspective(1000px) rotateY(16deg) rotateX(2deg) rotateZ(-7deg) scaleY(0.95) translateX(2%)",
            boxShadow: "48px 16px 48px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>
    </Box>
  );
};

export default Landing;
