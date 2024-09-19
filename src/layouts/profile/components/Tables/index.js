import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate function
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

// Other necessary imports
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

function Tables() {
  const navigate = useNavigate(); // Hook for navigation
  const [users] = useState([
    {
      id: 1,
      userName: "Mani",
      dateOfSubmission: "2024-08-01",
      dateOfReportDelivered: "2024-08-05",
    },
    {
      id: 2,
      userName: "Sundar",
      dateOfSubmission: "2024-07-25",
      dateOfReportDelivered: "2024-07-29",
    },
    {
      id: 3,
      userName: "Jegan",
      dateOfSubmission: "2024-09-01",
      dateOfReportDelivered: "2024-09-05",
    },
  ]);

  const handleView = (userId) => {
    navigate(`/admin/profile/profiledetails/${userId}`); // Navigate to user profile page with their ID
  };

  const columns = [
    { Header: "Name", accessor: "userName" },
    { Header: "Date of Submission", accessor: "dateOfSubmission" },
    { Header: "Date of Report Delivered", accessor: "dateOfReportDelivered" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = users.map((user) => ({
    userName: <span>{user.userName}</span>,
    dateOfSubmission: user.dateOfSubmission,
    dateOfReportDelivered: user.dateOfReportDelivered,
    actions: (
      <Button variant="contained" color="info" onClick={() => handleView(user.id)}>
        View
      </Button>
    ),
  }));

  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Profile Table
              </MDTypography>
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
    </MDBox>
  );
}

export default Tables;
