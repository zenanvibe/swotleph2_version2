import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import MDBox from "components/MDBox";
import { Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tables from "./components/Tables";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDTypography from "components/MDTypography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";

function Dashboard() {
  // State to control modal and form data
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    handwriting: null,
    dateOfSubmission: "",
  });
  const [users, setUsers] = useState([]); // Store the submitted users

  // Functions to open and close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      handwriting: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Add the form data to the users array
    setUsers([...users, formData]);

    // Reset form data for next user
    setFormData({
      userName: "",
      handwriting: null,
      dateOfSubmission: "",
    });

    // Close the modal after submission
    handleClose();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`; // Format as YYYY-MM-DD
  };

  const sampleUsers = [
    {
      userName: "Mani",
      handwriting: { name: "Handwriting Test 1" },
      dateOfSubmission: "2024-09-18",
      comment: "Excellent handwriting with attention to detail.",
      reportDownload: "/path/to/report1.pdf", // Demo report file path
    },
    {
      userName: "Sundar",
      handwriting: { name: "Handwriting Test 2" },
      dateOfSubmission: "2024-09-17",
      comment: "Handwriting could be improved for clarity.",
      reportDownload: "/path/to/report2.pdf", // Demo report file path
    },
    {
      userName: "Jegan",
      handwriting: { name: "Handwriting Test 3" },
      dateOfSubmission: "2024-09-16",
      comment: "No handwriting submitted for evaluation.",
      reportDownload: "/path/to/report3.pdf", // Demo report file path
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar role="user" />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<AccountCircleIcon />} // Icon for Username
                title="User Name"
                value="Nivin"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<BusinessIcon />} // Icon for Organization Name
                title="Organization Name"
                value="Brandmindz"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<CalendarTodayIcon />} // Icon for Date of Login
                title="Date of Login"
                value={getCurrentDate()}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Number of Profiles Added
                title="No of Profiles Added"
                value={45}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Add the Floating Button */}
        {/* <IconButton
          color="primary"
          onClick={handleOpen}
          style={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </IconButton> */}

        {/* Modal for Adding User */}
        <Modal open={open} onClose={handleClose}>
          <MDBox
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <MDTypography variant="h6" mb={2}>
              Add New User
            </MDTypography>
            <TextField
              fullWidth
              label="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="dateOfSubmission"
              value={formData.dateOfSubmission}
              onChange={handleInputChange}
              type="date"
              margin="normal"
              InputLabelProps={{
                shrink: true, // This will shrink the label so it won't overlap with the date value
              }}
              placeholder="Date of Submission" // Alternatively, you can use a placeholder
            />

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              style={{ marginTop: 16, marginBottom: 16 }}
            />
            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSubmit} style={{ color: "white" }}>
                Submit
              </Button>
            </MDBox>
          </MDBox>
        </Modal>
      </MDBox>

      {/* Pass the user data to the Tables component */}
      <Tables initialUsers={sampleUsers} />
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
