import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
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
        // console.log(userData);
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

  const statusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "review":
        return "default";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar role="admin" />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* User Details */}
          <Grid item xs={12}>
            <Card sx={{ padding: "20px", boxShadow: "0 3px 6px rgba(0,0,0,0.1)" }}>
              <MDBox mb={3}>
                <MDTypography variant="h4" color="primary" align="center">
                  {user.name} &#39; s Profile
                </MDTypography>
              </MDBox>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="h6">Personal Information</MDTypography>
                  <MDTypography variant="body1">
                    <strong>Email: </strong>
                    {user.email}
                  </MDTypography>
                  <MDTypography variant="body1">
                    <strong>Phone: </strong>
                    {user.phone}
                  </MDTypography>
                  <MDTypography variant="body1">
                    <strong>Role: </strong>
                    {user.role}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDTypography variant="h6">Company Information</MDTypography>
                  <MDTypography variant="body1">
                    <strong>Company: </strong>
                    {user.company_name}
                  </MDTypography>
                  <MDTypography variant="body1">
                    <strong>Status: </strong>
                    <Chip
                      label={user.report_status}
                      color={statusColor(user.report_status)}
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    />
                  </MDTypography>
                  <Button
                    color="primary"
                    onClick={handleOpenModal} // Open the modal on click
                    sx={{
                      marginTop: 2,
                    }}
                  >
                    Upload Report
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Comment Timeline */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" color="primary" align="center">
                  Comment History
                </MDTypography>
                {comments.map((comment) => (
                  <TimelineItem key={comment.id}>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      {editingComment === comment.id ? (
                        <>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            variant="outlined"
                          />
                          <Button onClick={() => handleSave(comment.id)} sx={{ margin: "8px 0" }}>
                            Save
                          </Button>
                          <Button onClick={() => setEditingComment(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <MDTypography variant="body2">
                            <strong>{comment.author_name}</strong>: {comment.comment} <br />
                            <small>{new Date(comment.created_at).toLocaleString()}</small>
                          </MDTypography>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => {
                              setEditingComment(comment.id);
                              setUpdatedComment(comment.comment);
                            }}
                            sx={{ marginTop: "8px" }}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </MDBox>
            </Card>
          </Grid>

          {/* Add New Comment */}
          <Grid item xs={12}>
            <Card>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Box width={{ xs: "100%", sm: "80%", md: "60%", lg: "50%" }}>
                  <MDTypography variant="h6" align="center">
                    Add a New Comment
                  </MDTypography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                    sx={{
                      resize: "vertical",
                      marginTop: "16px",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    sx={{ display: "block", margin: "16px auto", color: "white" }}
                  >
                    Submit
                  </Button>
                </Box>
              </MDBox>
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
