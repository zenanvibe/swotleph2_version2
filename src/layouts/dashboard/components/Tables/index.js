import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import API from "../../../../api/config"; // Import API base URL
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function Tables() {
  const [users, setUsers] = useState([]); // State to hold users list
  const [open, setOpen] = useState(false); // Dialog open state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity level (success, error, etc.)

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    file: null,
  });

  const navigate = useNavigate(); // Initialize navigate hook

  // Columns configuration for the DataTable
  const columns = [
    { Header: "Name", accessor: "name", width: "25%" },
    { Header: "Role", accessor: "role", width: "20%" },
    { Header: "Date of Submission", accessor: "dateOfSubmission", width: "30%" },
    { Header: "Actions", accessor: "actions", width: "25%" },
  ];

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

  // Create rows data with proper formatting
  const rows = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((user) => ({
      name: <div>{user.name || "N/A"}</div>,
      role: <div>{user.role || "N/A"}</div>,
      dateOfSubmission: <div>{formatDate(user.created_at || user.dateofsubmission)}</div>,
      actions: (
        <Button
          variant="contained"
          size="medium"
          style={{
            backgroundColor: "#E4003A",
            color: "white",
            textTransform: "none",
            minWidth: "80px",
          }}
          onClick={() => navigate(`/userprofile/${user.user_id}`)}
        >
          View
        </Button>
      ),
    }));
  };

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
      console.log("Fetched data:", data); // Debug log

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

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalUsers / itemsPerPage));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    formData.append("role", newUser.role); // Assuming role field is added to form
    formData.append("gender", newUser.gender); // Assuming gender field is added to form
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
          handwriting_url: uploadedFileUrl, // Store the file URL
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
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              mb={2}
              py={3}
              px={2}
              variant="gradient"
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              sx={{ backgroundColor: "#E4003A" }}
            >
              <MDTypography variant="h6" color="white" mt={1}>
                Users Table
              </MDTypography>

              {/* Add button to open dialog */}
              <IconButton color="inherit" onClick={handleClickOpen}>
                <AddIcon />
              </IconButton>
            </MDBox>
            <div style={{ height: "500px", overflow: "auto", marginLeft: "10px" }}>
              {loading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="400px">
                  <MDTypography>Loading...</MDTypography>
                </MDBox>
              ) : (
                <DataTable
                  table={{ columns, rows: rows(getPaginatedData()) }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              )}
            </div>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <MDTypography variant="button" color="text">
                Page {currentPage} of {totalPages}
              </MDTypography>
              <MDBox display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  endIcon={<NavigateNextIcon />}
                >
                  Next
                </Button>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for adding new user */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="tel"
            fullWidth
            variant="outlined"
            value={newUser.phone}
            onChange={handleInputChange}
          />

          {/* Role Field */}
          <TextField
            margin="dense"
            name="role"
            label="Role"
            select
            fullWidth
            variant="outlined"
            value={newUser.role}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="" />
            <option value="candidate">Candidate</option>
            <option value="employee">Employee</option>
          </TextField>

          {/* Gender Dropdown */}
          <TextField
            margin="dense"
            name="gender"
            label="Gender"
            select
            fullWidth
            variant="outlined"
            value={newUser.gender}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="" />
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </TextField>

          <TextField
            margin="dense"
            name="file"
            label="Handwriting Upload"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              const file = e.target.files[0];
              setNewUser((prev) => ({
                ...prev,
                file: file,
              }));
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
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
    </MDBox>
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
