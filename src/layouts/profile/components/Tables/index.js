import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate function
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit"; // Edit icon
import DeleteIcon from "@mui/icons-material/Delete"; // Delete icon
import API from "../../../../api/config"; // Import API base URL
import DownloadIcon from "@mui/icons-material/Download";

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
          const response = await fetch(`${API}company/staff/${selectedCompanyId}`, {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          // Initialize isEditing for each user
          const usersWithEditing = data.map((user) => ({
            ...user,
            isEditing: { name: false, email: false, phone: false, role: false }, // Initialize editing states
          }));
          setUsers(usersWithEditing); // Update state with the fetched user data
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

  // Handle edit and delete actions
  const handleEdit = (index, field) => {
    const updatedUsers = [...users];
    updatedUsers[index].isEditing[field] = true; // Set the field to be editable
    setUsers(updatedUsers);
  };

  const handleSave = (index, field) => {
    const updatedUsers = [...users];
    updatedUsers[index].isEditing[field] = false; // Stop editing
    // You can make API call here to save changes if needed
    setUsers(updatedUsers);
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index); // Remove user from the list
    setUsers(updatedUsers);
    // You can make API call here to delete user if needed
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Role", accessor: "role" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = users.map((user, index) => ({
    name: (
      <>
        {user.isEditing.name ? (
          <>
            <input
              type="text"
              defaultValue={user.name}
              style={{ padding: 5 }}
              onChange={(e) => (user.name = e.target.value)} // Update name in real-time
            />
            <Button onClick={() => handleSave(index, "name")}>Save</Button>
          </>
        ) : (
          <>
            {user.name}
            <IconButton onClick={() => handleEdit(index, "name")}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </>
    ),
    email: (
      <>
        {user.isEditing.email ? (
          <>
            <input
              type="email"
              defaultValue={user.email}
              style={{ padding: 5 }}
              onChange={(e) => (user.email = e.target.value)} // Update email in real-time
            />
            <Button onClick={() => handleSave(index, "email")}>Save</Button>
          </>
        ) : (
          <>
            {user.email}
            <IconButton onClick={() => handleEdit(index, "email")}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </>
    ),
    phone: (
      <>
        {user.isEditing.phone ? (
          <>
            <input
              type="tel"
              defaultValue={user.phone}
              style={{ padding: 5 }}
              onChange={(e) => (user.phone = e.target.value)} // Update phone in real-time
            />
            <Button onClick={() => handleSave(index, "phone")}>Save</Button>
          </>
        ) : (
          <>
            {user.phone}
            <IconButton onClick={() => handleEdit(index, "phone")}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </>
    ),
    role: (
      <>
        {user.isEditing.role ? (
          <>
            <input
              type="text"
              defaultValue={user.role}
              style={{ padding: 5 }}
              onChange={(e) => (user.role = e.target.value)} // Update role in real-time
            />
            <Button onClick={() => handleSave(index, "role")}>Save</Button>
          </>
        ) : (
          <>
            {user.role}
            <IconButton onClick={() => handleEdit(index, "role")}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </>
    ),
    actions: (
      <>
        <Button
          variant="contained"
          color="info"
          href="https://example.com/path/to/sample_file.png" // Replace with your actual file URL
          download={`sample_file.png`}
          style={{ marginRight: "14px" }}
        >
          <DownloadIcon style={{ marginRight: "4px" }} /> {/* Add the icon here */}
          Handwriting
        </Button>
        <Button variant="contained" color="info" onClick={() => handleView(user.user_id)}>
          View
        </Button>
        <IconButton onClick={() => handleDelete(index)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
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
