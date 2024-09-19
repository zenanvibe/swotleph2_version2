import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

function Tables() {
  // Sample data for the table
  const navigate = useNavigate();
  const companies = [
    {
      id: 1,
      companyName: "BrandMindz",
      interviewCandidateCount: 5,
      teamMemberCount: 12,
    },
    {
      id: 2,
      companyName: "Marine",
      interviewCandidateCount: 3,
      teamMemberCount: 9,
    },
    {
      id: 3,
      companyName: "Company",
      interviewCandidateCount: 8,
      teamMemberCount: 15,
    },
  ];

  const handletoprofile = () => {};

  // Columns for the DataTable
  const columns = [
    { Header: "Company", accessor: "companyName" },
    { Header: "Interview Candidate", accessor: "interviewCandidateCount" },
    { Header: "Team Member", accessor: "teamMemberCount" },
    { Header: "Action", accessor: "actions" },
  ];

  // Rows data for the DataTable
  const rows = companies.map((company) => ({
    companyName: company.companyName,
    interviewCandidateCount: company.interviewCandidateCount,
    teamMemberCount: company.teamMemberCount,
    onclick: { handletoprofile },
    actions: (
      <MDButton
        variant="contained"
        color="info"
        size="small"
        onClick={() => navigate("/admin/profile")}
      >
        View
      </MDButton>
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
                Companies Table
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
