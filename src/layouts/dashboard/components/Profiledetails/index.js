import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box, Divider, Typography } from "@mui/material";
import API from "../../../../api/config"; // Import API base URL

function UserProfile() {
  const { id } = useParams(); // Get user id from URL
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "comments"
  const textFieldRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API}users/${id}`, {
          method: "GET",
          headers: {
            Authorization: token ? `${token}` : "",
          },
        });
        const userData = await response.json();
        setUser(userData[0]); // Assuming the API returns an array
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API}comments/getcomments/${id}`, {
          method: "GET",
          headers: {
            Authorization: token ? `${token}` : "",
            "Content-Type": "application/json",
          },
        });
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchUserData();
    fetchComments();
  }, [id]);

  // Only restore scroll position when comments change and not during initial load
  useEffect(() => {
    // Only restore scroll if we're not in the middle of submitting a comment
    if (commentsContainerRef.current && activeTab === "comments" && !isSubmitting) {
      commentsContainerRef.current.scrollTop = scrollPosition;
    }
  }, [comments, activeTab, scrollPosition, isSubmitting]);

  // Save scroll position when scrolling the comments container
  const handleScroll = () => {
    if (commentsContainerRef.current) {
      setScrollPosition(commentsContainerRef.current.scrollTop);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async () => {
    if (!newComment.trim()) return; // Don't submit empty comments

    // Set submitting flag to prevent scroll restoration during submission
    setIsSubmitting(true);

    // Save current scroll position before submitting
    if (commentsContainerRef.current) {
      setScrollPosition(commentsContainerRef.current.scrollTop);
    }

    const token = localStorage.getItem("token");
    const authorId = localStorage.getItem("userId");
    try {
      const response = await fetch(`${API}comments/add`, {
        method: "POST",
        headers: {
          Authorization: token ? `${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
          userId: id,
          authorId: authorId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding comment");
      }

      const addedComment = await response.json();

      // Add the new comment to the existing comments array
      setComments((prevComments) =>
        Array.isArray(prevComments) ? [...prevComments, addedComment] : [addedComment]
      );

      setNewComment("");

      // Refresh comments without losing scroll position
      const refreshComments = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`${API}comments/getcomments/${id}`, {
            method: "GET",
            headers: {
              Authorization: token ? `${token}` : "",
              "Content-Type": "application/json",
            },
          });
          const commentsData = await response.json();
          setComments(commentsData);

          // After comments are loaded, scroll to the saved position
          setTimeout(() => {
            if (commentsContainerRef.current) {
              commentsContainerRef.current.scrollTop = scrollPosition;
              setIsSubmitting(false);
            }
          }, 100);
        } catch (error) {
          console.error("Error refreshing comments:", error);
          setIsSubmitting(false);
        }
      };

      refreshComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    if (user.report_url) {
      const link = document.createElement("a");
      link.href = user.report_url;
      link.target = "_blank";
      link.download = `${user.name}.report`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("No report URL available.");
    }
  };

  // Profile View
  const ProfileView = () => (
    <Box sx={{ p: 3, borderRadius: "17px" }}>
      <Typography
        variant="h4"
        color="black"
        mb={4}
        fontFamily="Kameron, serif"
        fontSize="16px"
        fontWeight="medium"
        border="1px solid #C4C4C4"
        borderRadius="16px"
        padding="20px"
      >
        My Profile
      </Typography>

      <Box sx={{ padding: "20px", border: "1px solid #C4C4C4", borderRadius: "23px", mb: 4 }}>
        <Typography
          variant="h6"
          mb={3}
          fontWeight="medium"
          fontFamily="Kameron, serif"
          fontSize="16px"
        >
          Personal Information
        </Typography>

        <Grid container spacing={4} className="css-mhc70k-MuiGrid-root">
          <Grid item xs={12} md={6} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Name
            </Typography>
            <Typography
              variant="body1"
              fontFamily="Kameron, serif"
              fontWeight="medium"
              fontSize="16px"
            >
              {user.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Role
            </Typography>
            <Typography
              variant="body1"
              fontFamily="Kameron, serif"
              fontWeight="medium"
              fontSize="16px"
            >
              {user.role}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Email Id
            </Typography>
            <Typography
              variant="body1"
              fontFamily="Kameron, serif"
              fontWeight="medium"
              fontSize="16px"
            >
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Phone Number
            </Typography>
            <Typography
              variant="body1"
              fontFamily="Kameron, serif"
              fontWeight="medium"
              fontSize="16px"
            >
              {user.phone}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: "20px", border: "1px solid #C4C4C4", borderRadius: "23px" }}>
        <Typography
          variant="h6"
          mb={3}
          fontWeight="medium"
          fontFamily="Kameron, serif"
          fontSize="16px"
        >
          Company Information
        </Typography>

        <Grid container spacing={4} className="css-mhc70k-MuiGrid-root">
          {/* Company Name */}
          <Grid item xs={12} md={4} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Company
            </Typography>
            <Typography
              variant="body1"
              fontFamily="Kameron, serif"
              fontWeight="medium"
              fontSize="16px"
            >
              {user.company_name}
            </Typography>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={4} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Status
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: user.report_status === "completed" ? "#4CAF50" : "#FF9800",
                fontFamily: "Kameron, serif",
                fontSize: "16px",
              }}
            >
              {user.report_status === "completed" ? "Completed" : user.report_status}
            </Typography>
          </Grid>

          {/* Report */}
          <Grid item xs={12} md={4} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Report
            </Typography>
            <Typography
              variant="body1"
              onClick={handleDownloadReport}
              sx={{
                color: "#0000FF",
                fontFamily: "Kameron, serif",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Download Report
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  // Comments View
  const CommentsView = () => (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        color="black"
        mb={4}
        fontFamily="Kameron, serif"
        fontSize="16px"
        fontWeight="medium"
        border="1px solid #C4C4C4"
        borderRadius="23px"
        padding="20px"
      >
        Comment
      </Typography>

      <Box sx={{ padding: "20px", border: "1px solid #C4C4C4", borderRadius: "16px", mb: 4 }}>
        <Typography
          variant="h6"
          mb={3}
          fontWeight="medium"
          fontFamily="Kameron, serif"
          fontSize="16px"
        >
          Add a New Comment
        </Typography>
        <Box sx={{ borderBottom: "1px solid #ccc", mb: 2 }}>
          {/* Fixed TextField implementation with useRef for focus retention */}
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              // Optional: Force cursor to end after each keystroke
              const input = e.target;
              const length = input.value.length;
              setTimeout(() => input.setSelectionRange(length, length), 0);
            }}
            inputRef={textFieldRef}
            variant="outlined"
            autoFocus
            onFocus={() => {
              // This timeout ensures the selection happens after React's rendering cycle
              setTimeout(() => {
                if (textFieldRef.current) {
                  const length = textFieldRef.current.value.length;
                  textFieldRef.current.setSelectionRange(length, length);
                }
              }, 0);
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                fontFamily: "Kameron, serif",
                fontSize: "16px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              minHeight: "100px",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#FFFFFf",
              textTransform: "none",
              borderRadius: "4px",
              fontFamily: "Kameron, serif",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#3d8b40",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          padding: "20px",
          border: "1px solid #C4C4C4",
          borderRadius: "16px",
          maxHeight: "500px", // Set a max height
          overflow: "auto", // Make it scrollable
        }}
        ref={commentsContainerRef}
        onScroll={handleScroll} // Add scroll event handler
      >
        <Typography
          variant="h6"
          mb={3}
          fontWeight="medium"
          fontFamily="Kameron, serif"
          fontSize="16px"
        >
          Comment History
        </Typography>

        {comments.length > 0 ? (
          <Box sx={{ position: "relative" }}>
            {comments.map((comment, index) => (
              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  mb: index === comments.length - 1 ? 0 : 4,
                  position: "relative",
                }}
              >
                {/* Timeline dot and line */}
                <Box
                  sx={{
                    width: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#C4C4C4",
                      zIndex: 2,
                    }}
                  />
                  {index !== comments.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "12px",
                        width: "1px",
                        height: "calc(100% + 1rem)",
                        bgcolor: "#C4C4C4",
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>

                {/* Comment content with date formatting like old code */}
                <Box sx={{ flex: 1, pl: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      fontFamily="Kameron, serif"
                      fontSize="16px"
                    >
                      {comment.author_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="span"
                      ml={1}
                      sx={{
                        color: "#FF0000",
                        fontFamily: "Kameron, serif",
                        fontSize: "14px",
                      }}
                    >
                      {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Kameron, serif"
                      fontSize="16px"
                    >
                      {comment.comment || "We will Check It and Update Soon"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            fontFamily="Kameron, serif"
            fontSize="16px"
          >
            There are no comments yet, add your first comment.
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar role="dashboard" />
      <MDBox pt={6} pb={3} px={2}>
        <Grid container>
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Left sidebar */}
              <Box
                sx={{
                  width: { xs: "100%", md: "177px" },
                  borderRight: { xs: "none", md: "1px solid #C4C4C4" },
                  bgcolor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
                className="css-1ab0c97"
              >
                <Box
                  onClick={() => setActiveTab("profile")}
                  sx={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: activeTab === "profile" ? "#FFC0CB" : "transparent",
                    color: activeTab === "profile" ? "#FF0000" : "#666",
                    borderRadius: "25px",
                    margin: "10px",
                    width: "87%",
                    textAlign: "center",
                  }}
                  className={activeTab === "profile" ? "css-vtbzsp" : ""}
                >
                  <Typography
                    variant="body1"
                    fontFamily="Kameron, serif"
                    fontSize="16px"
                    fontWeight={activeTab === "profile" ? "medium" : "medium"}
                  >
                    My profile
                  </Typography>
                </Box>

                <Box
                  onClick={() => setActiveTab("comments")}
                  sx={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: activeTab === "comments" ? "#FFC0CB" : "transparent",
                    color: activeTab === "comments" ? "#FF0000" : "#666",
                    borderRadius: "25px",
                    margin: "10px",
                    width: "87%",
                    textAlign: "center",
                  }}
                  className={activeTab === "comments" ? "css-vtbzsp" : ""}
                >
                  <Typography
                    variant="body1"
                    fontFamily="Kameron, serif"
                    fontSize="16px"
                    fontWeight={activeTab === "comments" ? "medium" : "medium"}
                  >
                    Comment
                  </Typography>
                </Box>
              </Box>

              {/* Main content */}
              <Box sx={{ flexGrow: 1 }}>
                {activeTab === "profile" ? <ProfileView /> : <CommentsView />}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserProfile;
