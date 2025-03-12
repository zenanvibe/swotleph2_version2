import React, { useEffect, useState } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import API from "../../../../api/config"; // Import API base URL

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserProfile() {
  const { id } = useParams(); // Get user id from URL
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "comments"
  const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const commentsData = await response.json();
        if (commentsData.length === 0) {
          console.log("No comments found for this user");
        } else {
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        // Handle error state here
      }
    };

    fetchUserData();
    fetchComments();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    const token = localStorage.getItem("token");

    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("id", id); // Append the user ID to the form data

    try {
      const response = await fetch(`${API}storage/upload/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
      setOpenSnackbar(true);

      // Close the modal after successful upload
      setOpenModal(false);
      setSelectedFile(null); // Reset file input
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Function to open the file upload modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
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

      // Ensure comments is always an array
      setComments((prevComments) =>
        Array.isArray(prevComments) ? [...prevComments, addedComment] : [addedComment]
      );

      setNewComment("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSave = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API}comments/edit/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: updatedComment }),
      });

      if (!response.ok) {
        throw new Error("Error updating comment");
      }

      const data = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, comment: updatedComment, updated_at: new Date() }
            : comment
        )
      );

      setEditingComment(null);
      setUpdatedComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
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
          <Grid item xs={12} md={4} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: user.report_status === "completed" ? "#4CAF50" : "#FF9800",
                  fontFamily: "Kameron, serif",
                  fontSize: "16px",
                  mr: 2,
                }}
              >
                {user.report_status === "completed" ? "Completed" : user.report_status}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ paddingTop: "6px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontFamily="Kameron, serif"
              fontSize="16px"
            >
              Report
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                onClick={handleOpenModal}
                sx={{
                  color: "#0000FF",
                  fontFamily: "Kameron, serif",
                  fontSize: "16px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Upload Report
              </Typography>
            </Box>
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
          {/* Fixed the text area to allow continuous typing */}
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            sx={{
              height: "16px",
              mb: 1,
              "& .MuiOutlinedInput-root": {
                fontFamily: "Kameron, serif",
                fontSize: "16px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
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

      <Box sx={{ padding: "20px", border: "1px solid #C4C4C4", borderRadius: "16px" }}>
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

                {/* Comment content with date formatting */}
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

                  {/* Comment editing/display */}
                  {editingComment === comment.id ? (
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontFamily: "Kameron, serif",
                            fontSize: "16px",
                          },
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button
                          onClick={() => handleSave(comment.id)}
                          sx={{
                            backgroundColor: "#4CAF50",
                            color: "#FFFFFF",
                            textTransform: "none",
                            fontFamily: "Kameron, serif",
                            fontSize: "14px",
                            "&:hover": {
                              backgroundColor: "#3d8b40",
                            },
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingComment(null)}
                          sx={{
                            color: "#666666",
                            textTransform: "none",
                            fontFamily: "Kameron, serif",
                            fontSize: "14px",
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontFamily="Kameron, serif"
                        fontSize="16px"
                      >
                        {comment.comment || "We will Check It and Update Soon"}
                      </Typography>
                      <Button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setUpdatedComment(comment.comment);
                        }}
                        sx={{
                          color: "#0000FF",
                          textTransform: "none",
                          fontFamily: "Kameron, serif",
                          fontSize: "14px",
                          padding: "0",
                          minWidth: "auto",
                          mt: 1,
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  )}
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
      <DashboardNavbar role="admin" />
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

      {/* Modal for File Upload */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Upload Report</DialogTitle>
        <DialogContent>
          <DialogContentText>Please choose the report file you want to upload.</DialogContentText>
          <input type="file" onChange={handleFileChange} style={{ marginTop: "20px" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFileUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for upload success message */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Report uploaded successfully!
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default UserProfile;
