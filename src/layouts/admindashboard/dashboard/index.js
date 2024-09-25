import { useState, useEffect } from "react";
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
import API from "../../../api/config"; // Import API base URL

function Dashboard() {
  // State to control data
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalProfiles: 0,
    totalProfilesCompleted: 0,
    totalProfilesPending: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [users, setUsers] = useState([]); // Store the submitted users

  // Fetch the card data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}card/dashboard/master`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

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
        console.error(err);
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
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<BusinessIcon />} // Icon for Total Companies
                title="Companies"
                value={loading ? "Loading..." : stats.totalCompanies}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<AccountCircleIcon />} // Icon for Total Profiles
                title="Profiles"
                value={loading ? "Loading..." : stats.totalProfiles}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<PendingActionsIcon />} // Icon for Profiles Pending
                title="Pending"
                value={loading ? "Loading..." : stats.totalProfilesPending}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Profiles Completed
                title="Completed"
                value={loading ? "Loading..." : stats.totalProfilesCompleted}
              />
            </MDBox>
          </Grid>
        </Grid>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </MDBox>
      <Tables users={users} />
    </DashboardLayout>
  );
}

export default Dashboard;
