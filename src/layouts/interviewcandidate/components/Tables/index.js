import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button"; // Import Button for report download
import IconButton from "@mui/material/IconButton"; // Import IconButton
import AddIcon from "@mui/icons-material/Add"; // Import Add Icon
import Dialog from "@mui/material/Dialog"; // Import Dialog
import DialogActions from "@mui/material/DialogActions"; // Import Dialog Actions
import DialogContent from "@mui/material/DialogContent"; // Import Dialog Content
import DialogTitle from "@mui/material/DialogTitle"; // Import Dialog Title
import TextField from "@mui/material/TextField"; // Import TextField
import { Chip } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";

function Tables({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false); // State for dialog
  const [newUser, setNewUser] = useState({
    userName: "",
    handwriting: "",
    dateOfSubmission: "",
    comment: "",
    reportDownload: "",
  });

  // Columns configuration for the DataTable
  const columns = [
    { Header: "User Name", accessor: "userName" },
    { Header: "Handwriting", accessor: "handwriting" },
    { Header: "Date of Submission", accessor: "dateOfSubmission" },
    { Header: "Suggestion", accessor: "suggestion" },
    { Header: "Report Download", accessor: "reportDownload" },
  ];

  const rows = users.map((user, index) => {
    // Track suggestion status for each user
    const [suggestionStatus, setSuggestionStatus] = useState("Under Review");

    return {
      userName: user.userName,
      handwriting: (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.open(user.handwriting.url || "#", "_blank")}
          disabled={!user.handwriting.url}
          style={{ color: "black" }}
        >
          View Handwriting
        </Button>
      ),
      dateOfSubmission: user.dateOfSubmission,
      suggestion: (
        <Chip
          label={suggestionStatus}
          color={
            suggestionStatus === "Under Review"
              ? "default"
              : suggestionStatus === "Suggested"
              ? "success"
              : "warning" // Color for "Not Suggested"
          }
          clickable
          onClick={() => {
            setSuggestionStatus((prev) => {
              if (prev === "Under Review") return "Suggested";
              if (prev === "Suggested") return "Not Suggested";
              return "Suggested"; // Loop back to "Suggested"
            });
          }}
          style={{ cursor: "pointer", color: "white" }}
        />
      ),
      reportDownload: (
        <Button
          variant="contained"
          color="primary"
          href={user.reportDownload}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          Download Report
        </Button>
      ),
    };
  });

  // Open Dialog to Add User
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    const newUserData = {
      userName: newUser.userName,
      handwriting: { name: newUser.handwriting },
      dateOfSubmission: newUser.dateOfSubmission,
      // comment: newUser.comment,
      // reportDownload: newUser.reportDownload,
    };

    setUsers([...users, newUserData]); // Add new user to users state
    setOpen(false); // Close dialog after submitting
    setNewUser({
      userName: "",
      handwriting: "",
      dateOfSubmission: "",
      // comment: "",
      // reportDownload: "",
    }); // Reset input fields
  };

  // Handle input changes
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
          {/* <TextField
            margin="dense"
            name="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.comment}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="reportDownload"
            label="Report Download URL"
            type="url"
            fullWidth
            variant="outlined"
            value={newUser.reportDownload}
            onChange={handleInputChange}
          /> */}
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

// Adding prop types validation for users
Tables.propTypes = {
  initialUsers: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string.isRequired,
      handwriting: PropTypes.object, // Since it can be a file object
      dateOfSubmission: PropTypes.string.isRequired,
      comment: PropTypes.string,
      reportDownload: PropTypes.string,
    })
  ).isRequired,
};

export default Tables;
