import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import {
  Grid,
  Box,
  Typography,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tables from "./components/Tables";
import featherImage from "assets/images/feather.png";
import MDTypography from "components/MDTypography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import CloseIcon from "@mui/icons-material/Close";
import API from "../../api/config";
import PersonIcon from "@mui/icons-material/Person";

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    gender: "",
    handwriting: null,
  });
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    companyName: "",
    numberOfEmployees: 0,
    numberOfCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      handwriting: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    setUsers([...users, formData]);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "",
      gender: "",
      handwriting: null,
    });
    handleClose();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/sign-in");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <DashboardLayout>
      <DashboardNavbar role="user" />
      <MDBox py={3} px={isMobile ? 2 : 3}>
        {/* Top Section Layout - Using Grid for responsiveness */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 3 }}>
          {/* Welcome Card */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "24px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", mb: 1 }}>
                  Hello{" "}
                  {userInfo.userName || (
                    <>
                      {" "}
                      <CircularProgress size={18} sx={{ ml: 1, verticalAlign: "middle" }} />
                    </>
                  )}{" "}
                  !
                </Typography>
                <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "#666", mb: 0.5 }}>
                  It&apos;s good to see you again here 👋
                </Typography>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  sx={{ color: "#f44336", fontWeight: "medium" }}
                >
                  {userInfo.companyName || (
                    <>
                      {" "}
                      <CircularProgress size={16} sx={{ ml: 1, verticalAlign: "middle" }} />
                    </>
                  )}
                </Typography>
              </Box>
              <Box
                component="img"
                src={featherImage}
                alt="Feather"
                sx={{
                  height: isMobile ? "60px" : "80px",
                  display: { xs: "none", sm: "block" },
                }}
              />
            </Box>
          </Grid>

          {/* Candidates Card */}
          <Grid item xs={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <PersonIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#000", mb: 1 }} />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: "medium", color: "#f44336", mb: 1 }}
              >
                Candidates
              </Typography>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{ fontWeight: "bold", color: "#444" }}
              >
                {userInfo.numberOfCandidates !== 0 ? (
                  userInfo.numberOfCandidates
                ) : (
                  <>
                    {" "}
                    <CircularProgress size={20} sx={{ ml: 1, verticalAlign: "middle" }} />
                  </>
                )}
              </Typography>
            </Box>
          </Grid>

          {/* Employees Card */}
          <Grid item xs={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <GroupIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#000", mb: 1 }} />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: "medium", color: "#f44336", mb: 1 }}
              >
                Employees
              </Typography>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{ fontWeight: "bold", color: "#444" }}
              >
                {loading ? (
                  <>
                    {" "}
                    <CircularProgress size={20} sx={{ ml: 1, verticalAlign: "middle" }} />
                  </>
                ) : (
                  userInfo.numberOfEmployees
                )}
              </Typography>
            </Box>
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
      <Box sx={{ px: isMobile ? 2 : 3 }}>
        <Tables initialUsers={users} />
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
