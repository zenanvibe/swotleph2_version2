import { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tables from "./components/Tables";
import MDBox from "components/MDBox";
import { Grid } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GroupIcon from "@mui/icons-material/Group";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";

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
  // const handleOpen = () => setOpen(true);
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

  return (
    <DashboardLayout>
      <DashboardNavbar role="admin" />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<BusinessIcon />} // Icon for Username
                title="Total no. of Companies"
                value="3"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<AccountCircleIcon />} // Icon for Organization Name
                title="Total no. of Profiles"
                value="18"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<PendingActionsIcon />} // Icon for Date of Login
                title="Profile Pending"
                value="4"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Number of Profiles Added
                title="Profile Completed"
                value={14}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* Pass the user data to the Tables component */}
      <Tables users={users} />
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
