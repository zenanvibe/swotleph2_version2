import React, { useState, useEffect } from "react";
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
  const [users, setUsers] = useState([]); // State to store user data

  // Fetch users based on the selected company ID
  useEffect(() => {
    const fetchUsers = async () => {
      const selectedCompanyId = sessionStorage.getItem("selectedCompanyId");
      const token = localStorage.getItem("token"); // Get JWT token from localStorage

      if (selectedCompanyId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v2/company/staff/${selectedCompanyId}`,
            {
              method: "GET",
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUsers(data); // Update state with the fetched user data
        } catch (error) {
          console.error("Error fetching users:", error);
          alert("Failed to load user data.");
        }
      }
    };

    fetchUsers();
  }, []);

  // Function to handle "View" button click
  const handleView = (userId) => {
    // Store the user ID in sessionStorage
    sessionStorage.setItem("selectedUserId", userId);

    // Navigate to user profile details page
    navigate(`/admin/profile/profiledetails/${userId}`);
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Role", accessor: "role" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = users.map((user) => ({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    actions: (
      <Button variant="contained" color="info" onClick={() => handleView(user.user_id)}>
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
