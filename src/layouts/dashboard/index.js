import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import API from "../../api/config"; // Import API base URL



function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    handwriting: null,
    dateOfSubmission: "",
  });
  const [users, setUsers] = useState([]); // Store the submitted users
  const [userInfo, setUserInfo] = useState({
    userName: "",
    companyName: "",
    numberOfEmployees: 0,
    numberOfCandidates: 0,
  }); // Store fetched user info

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

    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  // Fetch user data from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Get userId from local storage

    if (!token || !userId) {
      navigate("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${API}card/dashboard/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserInfo({
          userName: data[0]?.user_name || "",
          companyName: data[0]?.company_name || "",
          numberOfEmployees: data[0]?.number_of_employees || 0,
          numberOfCandidates: data[0]?.number_of_interview_candidates || 0,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [navigate]);

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
                value={userInfo.userName || "N/A"}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<BusinessIcon />} // Icon for Organization Name
                title="Organization Name"
                value={userInfo.companyName || "N/A"}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Number of Profiles Added
                title="No of Interview Candidates Added"
                value={userInfo.numberOfCandidates || 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Number of Profiles Added
                title="No of Profiles Added"
                value={userInfo.numberOfCandidates || 0}
              />
            </MDBox>
          </Grid>
        </Grid>

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
      <Tables initialUsers={users} />
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
