import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import API from "../../../../api/config";
// Add missing imports
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function Tables() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Changed from 10 to 5 items per page
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    file: null,
  });

  const navigate = useNavigate();

  // Function to fetch user data
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    setLoading(true);

    try {
      const response = await fetch(`${API}company/staff/${companyId}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setUsers(data);
        setTotalUsers(data.length);
      } else if (data.users) {
        setUsers(data.users);
        setTotalUsers(data.total || data.users.length);
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSnackbarMessage("Error fetching users. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalUsers / itemsPerPage));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle file change event
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewUser((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  // Handle form submission to add a new user
  const handleSubmit = async () => {
    const formData = new FormData();
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    // Append form data
    formData.append("name", newUser.name);
    formData.append("email", newUser.email);
    formData.append("phone", newUser.phone);
    formData.append("company_id", companyId);
    formData.append("role", newUser.role);
    formData.append("gender", newUser.gender);
    if (newUser.file) {
      formData.append("file", newUser.file);
    }

    try {
      const response = await fetch(`${API}auth/dashboard/employee/signup`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Assuming the server response contains the file URL as fileUrl
      const uploadedFileUrl = data.fileUrl;

      // Update users state with the new user and file URL
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          ...newUser,
          handwriting_url: uploadedFileUrl,
        },
      ]);

      // Refetch the updated user list
      await fetchUsers();

      // Show success Snackbar
      setSnackbarMessage("User added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      console.log("Success: User added");

      // Reset the form
      setNewUser({
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "",
        gender: "",
        file: null,
      });
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error adding user:", error);
      // Show error Snackbar
      setSnackbarMessage("Error adding user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Open Dialog to Add User
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{}}>
      <Card
        sx={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "17px",
          overflow: "hidden",
          maxWidth: "1200px",
          margin: "0 auto", // Center the table
        }}
      >
        {/* Table Header */}
        <div
          style={{
            backgroundColor: "white",
            padding: "15px 20px",
            borderBottom: "3px solid #D9D9D9",
            textAlign: "center", // Center the title
          }}
        >
          <MDTypography
            variant="h6"
            color="error"
            fontWeight="bold"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
            }}
          >
            Users Table
          </MDTypography>
        </div>

        {/* Table Content */}
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" height="300px">
            <MDTypography>Loading...</MDTypography>
          </MDBox>
        ) : (
          <div
            style={{
              overflowX: "auto", // Add horizontal scroll for mobile
              padding: "0 10px",
            }}
          >
            <div
              style={{
                maxHeight: "500px", // Increased height to show more rows
                overflowY: "auto", // Make it scrollable vertically
                marginBottom: "10px", // Reduced gap below content
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                  <tr>
                    <th
                      style={{
                        padding: "12px 15px", // Slightly reduced padding
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee", // Add border for better separation
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Role
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Date of Submission
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((user, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                        }}
                      >
                        {user.name || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                        }}
                      >
                        {user.role || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                        }}
                      >
                        {formatDate(user.created_at || user.dateofsubmission)}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            backgroundColor: "#E4003A",
                            color: "white",
                            textTransform: "none",
                            fontSize: "10px",
                            fontWeight: "regular",
                            fontFamily: "Kameron, sans-serif",
                            borderRadius: "7px",
                            padding: "3px 10px",
                          }}
                          onClick={() => navigate(`/userprofile/${user.user_id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          borderTop="1px solid #eee"
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Page {currentPage} of {totalPages}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              startIcon={<NavigateBeforeIcon />}
              sx={{
                borderColor: "#ccc",
                color: "#555",
                textTransform: "none",
                fontFamily: "Kameron, sans-serif",
                fontSize: "12px",
                "&:hover": {
                  borderColor: "#E4003A",
                  color: "#E4003A",
                },
                "&.Mui-disabled": {
                  color: "#ccc",
                  borderColor: "#eee",
                },
              }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              endIcon={<NavigateNextIcon />}
              sx={{
                borderColor: "#ccc",
                color: "#555",
                textTransform: "none",
                fontFamily: "Kameron, sans-serif",
                fontSize: "12px",
                "&:hover": {
                  borderColor: "#E4003A",
                  color: "#E4003A",
                },
                "&.Mui-disabled": {
                  color: "#ccc",
                  borderColor: "#eee",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Add User Button - Redesigned to match the image */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px", // Add space between table and button
          marginBottom: "20px",
          maxWidth: "1200px",
          margin: "20px auto 0", // Center with the table and add top margin
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#E73C4E", // Bright red color matching the image
            color: "white",
            borderRadius: "25px", // Rounded corners
            padding: "10px 20px",
            textTransform: "none", // Prevent uppercase transformation
            fontFamily: "Kameron, serif",
            fontSize: "16px",
            fontWeight: "regular",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px", // Space between icon and text
          }}
          onClick={handleClickOpen}
          startIcon={
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "-3px", // Adjust to reduce extra space from startIcon
              }}
            >
              <span
                style={{
                  color: "#E73C4E",
                  fontSize: "16px",
                  fontWeight: "bold",
                  lineHeight: 1,
                  marginTop: "-1px", // Fine-tune vertical alignment
                }}
              >
                +
              </span>
            </div>
          }
        >
          Add User
        </Button>
      </div>

      {/* Dialog for adding new user - Redesigned with your requested changes */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
            maxWidth: "95vw",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            padding: "20px",
            borderBottom: "none",
            textAlign: "center",
            position: "relative",
            paddingBottom: "10px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Add New User
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "2px",
              backgroundColor: "#555555",
              margin: "8px auto 0",
            }}
          />
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              right: "16px",
              top: "16px",
              padding: "4px",
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "20px 30px" }}>
          {[
            { label: "Full Name", name: "name" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" },
            {
              label: "Role",
              name: "role",
              isSelect: true,
              options: ["", "Candidate", "Employee"],
            },
            {
              label: "Gender",
              name: "gender",
              isSelect: true,
              options: ["", "Male", "Female", "Other"],
            },
          ].map((field) => (
            <Box key={field.name} sx={{ mb: 3, position: "relative", mt: 1.5 }}>
              {/* Floating label positioned on the border */}
              <InputLabel
                htmlFor={field.name}
                sx={{
                  position: "absolute",
                  top: "-5px",
                  left: "10px",
                  color: "#000000",
                  zIndex: 1,
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "'Poppins', serif",
                  backgroundColor: "#FFFFFF",
                  padding: "0 10px",
                }}
              >
                {field.label}
              </InputLabel>

              {field.isSelect ? (
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "100%",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Select
                    id={field.name}
                    name={field.name}
                    value={newUser[field.name]}
                    onChange={handleInputChange}
                    displayEmpty
                    variant="standard"
                    IconComponent={() => (
                      <Box
                        sx={{
                          position: "absolute",
                          right: "10px",
                          pointerEvents: "none",
                          fontSize: "10px",
                          color: "#666",
                        }}
                      >
                        &#9662; {/* Unicode for a downward-pointing triangle (V shape) */}
                      </Box>
                    )}
                    sx={{
                      width: "100%",
                      height: "100%",
                      padding: "0 10px",
                      ".MuiSelect-select": {
                        padding: "0",
                        border: "none",
                      },
                      ".MuiInput-underline:before, .MuiInput-underline:after": {
                        display: "none",
                      },
                    }}
                  >
                    {field.options.map((option, index) => (
                      <MenuItem key={index} value={option ? option.toLowerCase() : ""}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : (
                <TextField
                  id={field.name}
                  name={field.name}
                  fullWidth
                  variant="outlined"
                  type={field.type || "text"}
                  value={newUser[field.name]}
                  onChange={handleInputChange}
                  InputProps={{
                    sx: {
                      height: "40px",
                      borderRadius: "5px",
                    },
                  }}
                  sx={{
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #ddd",
                    },
                    "& .MuiInputLabel-root": {
                      display: "none", // Hide default floating label
                    },
                  }}
                />
              )}
            </Box>
          ))}

          <Box sx={{ mb: 3, position: "relative", mt: 1.5 }}>
            {/* Floating label for handwriting upload */}
            <InputLabel
              sx={{
                position: "absolute",
                top: "-4px",
                left: "10px",
                zIndex: 1,
                fontSize: "12px",
                fontWeight: 500,
                color: "#000000",
                fontFamily: "'Poppins', serif",
                backgroundColor: "#FFFFFF",
                padding: "0 4px",
              }}
            >
              Handwriting Upload
            </InputLabel>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{
                  mr: 1,
                  textTransform: "none",
                  borderColor: "#ddd",
                  color: "#000000",
                  fontSize: "10px",
                  padding: "1px 10px",
                  height: "10px",
                  fontWeight: "regular",
                  fontFamily: "'Kameron', sans-serif",
                }}
              >
                Choose File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <Typography sx={{ color: "#666", fontSize: "14px" }}>
                {newUser.file ? newUser.file.name : "No file chosen"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#E4003A",
                color: "#FFFFFF",
                textTransform: "none",
                borderRadius: "25px",
                padding: "6px 0",
                width: "100px",
                fontSize: "16px",
                fontWeight: "500",
                fontFamily: "'Poppins', sans-serif",
                "&:hover": {
                  backgroundColor: "#C5003A",
                },
              }}
              onClick={handleSubmit}
            >
              ADD
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

Tables.propTypes = {
  initialUsers: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string.isRequired,
      handwriting: PropTypes.object,
      dateOfSubmission: PropTypes.string.isRequired,
      reportDownload: PropTypes.string,
    })
  ),
};

export default Tables;
