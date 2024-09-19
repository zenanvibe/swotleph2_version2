import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box } from "@mui/material";

const userData = [
  {
    id: 1,
    userName: "Mani",
    history:
      "Mani was prescribed a time management course on 2024-05-15 to improve productivity. Follow-up on 2024-06-10 suggested continued improvement but advised focusing on punctuality. On 2024-07-05, Mani started using a new tool for task scheduling, which showed promising results.As of 2024-08-01, the last review showed positive changes in daily routines.",
    lastSuggestion: "Improve time management.",
  },
  {
    id: 2,
    userName: "Sundar",
    history: "History of Sundar's prescriptions...",
    lastSuggestion: "Enhance communication skills.",
  },
  {
    id: 3,
    userName: "Jegan",
    history: "History of Jegan's prescriptions...",
    lastSuggestion: "Focus on attention to detail.",
  },
];

function UserProfile() {
  const { id } = useParams(); // Get the user id from the URL
  const [user, setUser] = useState(null);
  const [nextSuggestion, setNextSuggestion] = useState(""); // For new suggestion comment

  useEffect(() => {
    const foundUser = userData.find((u) => u.id === parseInt(id, 10));
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = () => {
    alert(`Next suggestion for ${user.userName}: ${nextSuggestion}`);
    setNextSuggestion("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar role="admin" />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6">User Details</MDTypography>
                <MDTypography variant="body1">Name: {user.userName}</MDTypography>
                <MDTypography variant="body1">Last Suggestion: {user.lastSuggestion}</MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6">Prescription History</MDTypography>
                <MDTypography variant="body2">{user.history}</MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Box width={{ xs: "100%", sm: "80%", md: "60%", lg: "50%" }}>
                  <MDTypography variant="h6" align="center">
                    Next Prescription Suggestion
                  </MDTypography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={nextSuggestion}
                    onChange={(e) => setNextSuggestion(e.target.value)}
                    variant="outlined"
                    sx={{
                      resize: "vertical", // Makes it resizable vertically
                      marginTop: "16px",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ display: "block", margin: "16px auto", color: "white  " }}
                  >
                    Submit
                  </Button>
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserProfile;
