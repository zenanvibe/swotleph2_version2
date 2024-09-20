import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed
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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v2/card/dashboard/master", {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI5LCJlbWFpbCI6ImFudG9qb2VsQGJyYW5kbWluZHouY29tIiwibmFtZSI6IkFudG8gSm9lbCIsInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNzI2NzQwMDIxLCJleHAiOjE3MjczNDQ4MjF9.9xH76gTZz6kT3u3zSXimwko9lODXBPDclau1cloMf-I",
          },
        });
        const data = response.data[0];
        setStats({
          totalCompanies: data.total_companies,
          totalProfiles: data.total_profiles,
          totalProfilesCompleted: data.total_profiles_completed,
          totalProfilesPending: data.total_profiles_pending,
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
                title="Total no. of Companies"
                value={loading ? "Loading..." : stats.totalCompanies}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<AccountCircleIcon />} // Icon for Total Profiles
                title="Total no. of Profiles"
                value={loading ? "Loading..." : stats.totalProfiles}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<PendingActionsIcon />} // Icon for Profiles Pending
                title="Profile Pending"
                value={loading ? "Loading..." : stats.totalProfilesPending}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<GroupIcon />} // Icon for Profiles Completed
                title="Profile Completed"
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
