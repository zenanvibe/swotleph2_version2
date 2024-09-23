import React, { useState, useEffect } from "react";
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
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom"; // Import useHistory to navigate
import API from "../../../../api/config"; // Import API base URL

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";

function Tables() {
  const [users, setUsers] = useState([]); // State for users
  const [open, setOpen] = useState(false); // State for dialog
  const history = useNavigate(); // Hook for navigation to user profile page
  const [newUser, setNewUser] = useState({
    userName: "",
    handwriting: "",
    dateOfSubmission: "",
  });

  // Columns configuration for the DataTable
  const columns = [
    { Header: "User Name", accessor: "name" },
    { Header: "Handwriting", accessor: "handwriting" },
    { Header: "Date of Submission", accessor: "dateOfSubmission" },
    { Header: "Report Status", accessor: "report_status" },
    { Header: "Actions", accessor: "actions" }, // Actions for profile and report download
  ];

  // Mapping fetched users to the table rows
  const rows = users.map((user) => ({
    name: user.name, // User's name from API response
    handwriting: (
      <Button
        variant="outlined"
        color="primary"
        onClick={() => window.open(user.handwritting_url || "#", "_blank")}
        disabled={!user.handwritting_url}
        style={{ color: "black" }}
      >
        View Handwriting
      </Button>
    ),
    dateOfSubmission: user.dob || "N/A", // Use dob if available
    report_status: (
      <Chip
        label={user.report_status}
        color={user.report_status === "pending" ? "warning" : "success"} // Color chip based on status
      />
    ),
    actions: (
      <>
        {/* View Profile Button */}
        <Button
          variant="contained"
          color="info"
          onClick={() => history(`/profile/${user.user_id}`)}
          style={{ marginRight: 8 }}
        >
          View Profile
        </Button>

        {/* Download Report Button */}
        <Button
          variant="contained"
          color="success"
          onClick={() => handleReportDownload(user.user_id)}
          disabled={user.report_status === "pending"} // Disable if report is not ready
        >
          Download Report
        </Button>
      </>
    ),
  }));

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("company_id");

      try {
        const response = await fetch(
          `${API}company/staff/${companyId}?role=candidate`,
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUsers(data); // Set users state with fetched data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to download report
  const handleReportDownload = (userId) => {
    const token = localStorage.getItem("token");
    fetch(`${API}reports/download/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${userId}.pdf`); // Define the download name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error downloading report:", error));
  };

  // Open Dialog to Add User
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form submission for adding a new user
  const handleSubmit = () => {
    const newUserData = {
      name: newUser.userName,
      handwriting: { name: newUser.handwriting },
      dateOfSubmission: newUser.dateOfSubmission,
    };

    setUsers([...users, newUserData]); // Add new user to users state
    setOpen(false); // Close dialog after submitting
    setNewUser({
      userName: "",
      handwriting: "",
      dateOfSubmission: "",
    }); // Reset input fields
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
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
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
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
            autoFocus
            margin="dense"
            name="userName"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.userName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="handwriting"
            label="Handwriting Upload"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              // Update the state to store the file, not text
              const file = e.target.files[0];
              setNewUser((prev) => ({
                ...prev,
                handwriting: file,
              }));
            }}
          />
          <TextField
            margin="dense"
            name="dateOfSubmission"
            label="Date of Submission"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newUser.dateOfSubmission}
            onChange={handleInputChange}
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

export default Tables;
