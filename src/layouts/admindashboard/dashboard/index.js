import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tables from "./components/Tables";
import MDBox from "components/MDBox";
import { Grid, Card, Typography, Box } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import API from "../../../api/config";

const cardData = [
  {
    title: "Companies",
    key: "totalCompanies",
    color: "#FF0000",
    icon: <BusinessIcon sx={{ color: "#fff" }} />,
    iconBg: "#F15252",
  },
  {
    title: "Profiles",
    key: "totalProfiles",
    color: "#1E88E5",
    icon: <AccountCircleIcon sx={{ color: "#fff" }} />,
    iconBg: "#4E97F0",
  },
  {
    title: "Completed",
    key: "totalProfilesCompleted",
    color: "#4CAF50",
    icon: <GroupIcon sx={{ color: "#fff" }} />,
    iconBg: "#5DC264",
  },
  {
    title: "Pending",
    key: "totalProfilesPending",
    color: "#E91E63",
    icon: <PendingActionsIcon sx={{ color: "#fff" }} />,
    iconBg: "#E94F92",
  },
];

function Dashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalProfiles: 0,
    totalProfilesCompleted: 0,
    totalProfilesPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}card/dashboard/master`, {
          method: "GET",
          headers: { Authorization: token },
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        const dashboardData = data[0];
        setStats({
          totalCompanies: dashboardData.total_companies,
          totalProfiles: dashboardData.total_profiles,
          totalProfilesCompleted: dashboardData.total_profiles_completed,
          totalProfilesPending: dashboardData.total_profiles_pending,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar role="admin" />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {cardData.map(({ title, key, color, icon, iconBg }) => (
            <Grid item xs={12} md={6} lg={3} key={key}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 0,
                  pl: 3, // Add padding to account for inset vertical line
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  height: "130px",
                  position: "relative",
                  overflow: "visible",
                  backgroundColor: "#fff",
                }}
              >
                {/* Vertical line slightly inset */}
                <Box
                  sx={{
                    borderLeft: `4px solid ${color}`,
                    height: "60%",
                    position: "absolute",
                    left: "10px", // Moved inside
                  }}
                />

                {/* Content */}
                <Box sx={{ pl: 2, flexGrow: 1, zIndex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    color="text.secondary"
                    sx={{ fontSize: "16px", pt: 2 }}
                  >
                    {title}
                  </Typography>
                  <Typography variant="h1" fontWeight="700" sx={{ color: color, fontSize: "40px" }}>
                    {loading ? "Loading..." : stats[key].toString().padStart(2, "0")}
                  </Typography>
                </Box>

                {/* Icon at top right */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: iconBg,
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                  }}
                >
                  {icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        {error && <Typography color="error">{error}</Typography>}
      </MDBox>
      <Tables users={users} />
    </DashboardLayout>
  );
}

export default Dashboard;
