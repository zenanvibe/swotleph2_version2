import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import API from "../../../../../api/config"; // Import API base URL

function Tables() {
  const [companies, setCompanies] = useState([]); // State to store company data
  const navigate = useNavigate();

  // Fetch company data from API on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API}company`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const data = await response.json();
        setCompanies(data); // Update state with the fetched company data
      } catch (error) {
        console.error("Error fetching companies:", error);
        alert("Failed to load company data.");
      }
    };

    fetchCompanies();
  }, []);

  const handleViewClick = (companyId) => {
    // Store the company ID in sessionStorage
    sessionStorage.setItem("selectedCompanyId", companyId);

    // Navigate to the profile page
    navigate("/admin/profile");
  };

  // Columns for the DataTable
  const columns = [
    { Header: "Company", accessor: "company_name" },
    { Header: "Interview Candidate", accessor: "number_of_candidates" },
    { Header: "Team Member", accessor: "number_of_employees" },
    { Header: "Action", accessor: "actions" },
  ];

  // Rows data for the DataTable
  const rows = companies.map((company) => ({
    company_name: company.company_name,
    number_of_candidates: company.number_of_candidates,
    number_of_employees: company.number_of_employees,
    actions: (
      <MDButton
        variant="contained"
        color="info"
        size="small"
        onClick={() => handleViewClick(company.company_id)}
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
