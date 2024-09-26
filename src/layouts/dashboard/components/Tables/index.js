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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import API from "../../../../api/config"; // Import API base URL

function Tables() {
  const [users, setUsers] = useState([]); // State to hold users list
  const [open, setOpen] = useState(false); // Dialog open state
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
    { Header: "Name", accessor: "name" },
    { Header: "Role", accessor: "role" },
    { Header: "Date of Submission", accessor: "dateOfSubmission" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = users.map((user) => ({
    name: user.name,
    role: user.role,
    dateOfSubmission: new Date(user.dateofsubmission).toLocaleDateString("en-IN"), // Format date to IST
    actions: (
      <>
        <Button
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          component="a"
          href={user.handwritting_url} // Use the URL from the API response
          download={`${user.name}_Handwriting.png`} // Filename for the downloaded file
        >
          Download Handwriting
        </Button>
        <Button
          variant="contained"
          style={{ color: "white", marginLeft: "8px", backgroundColor: "#E4003A" }}
          onClick={() => navigate(`/userprofile/${user.user_id}`)} // Update to the correct path for user profile
        >
          View
        </Button>
      </>
    ),
  }));

  // Function to fetch user data
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

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
      setUsers(data); // Set the users list in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              sx={{ backgroundColor: "#E4003A" }}
            >
              <MDTypography variant="h6" color="white">
                Users Table
              </MDTypography>

              {/* Add button to open dialog */}
              <IconButton color="inherit" onClick={handleClickOpen}>
                <AddIcon />
              </IconButton>
            </MDBox>
            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
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
  ).isRequired,
};

export default Tables;
