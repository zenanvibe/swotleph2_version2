import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import API from "../../../../api/config";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

function Tables() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0); // Changed to 0-based indexing
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const selectedCompanyId = sessionStorage.getItem("selectedCompanyId");
      const token = localStorage.getItem("token");

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
          const usersWithEditing = data.map((user) => ({
            ...user,
            isEditing: { name: false, email: false, phone: false, role: false },
          }));
          setUsers(usersWithEditing);
        } catch (error) {
          console.error("Error fetching users:", error);
          alert("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, []);

  // Pagination calculations
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / pageSize);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1); // Convert 1-based to 0-based indexing
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when changing page size
  };

  const handleView = (userId) => {
    sessionStorage.setItem("selectedUserId", userId);
    navigate(`/admin/profile/profiledetails/${userId}`);
  };

  const handleEdit = (index, field) => {
    const globalIndex = startIndex + index;
    const updatedUsers = [...users];
    updatedUsers[globalIndex].isEditing[field] = true;
    setUsers(updatedUsers);
  };

  const handleSave = (index, field) => {
    const globalIndex = startIndex + index;
    const updatedUsers = [...users];
    updatedUsers[globalIndex].isEditing[field] = false;
    setUsers(updatedUsers);
  };

  const handleDelete = (index) => {
    const globalIndex = startIndex + index;
    const updatedUsers = users.filter((_, i) => i !== globalIndex);
    setUsers(updatedUsers);
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Role", accessor: "role" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = paginatedUsers.map((user, index) => ({
    name: (
      <>
        {user.isEditing.name ? (
          <>
            <input
              type="text"
              defaultValue={user.name}
              style={{ padding: 5 }}
              onChange={(e) => {
                const globalIndex = startIndex + index;
                const updatedUsers = [...users];
                updatedUsers[globalIndex].name = e.target.value;
                setUsers(updatedUsers);
              }}
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
              onChange={(e) => {
                const globalIndex = startIndex + index;
                const updatedUsers = [...users];
                updatedUsers[globalIndex].email = e.target.value;
                setUsers(updatedUsers);
              }}
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
              onChange={(e) => {
                const globalIndex = startIndex + index;
                const updatedUsers = [...users];
                updatedUsers[globalIndex].phone = e.target.value;
                setUsers(updatedUsers);
              }}
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
              onChange={(e) => {
                const globalIndex = startIndex + index;
                const updatedUsers = [...users];
                updatedUsers[globalIndex].role = e.target.value;
                setUsers(updatedUsers);
              }}
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
          href={user.report_url}
          download={`${user.name}.handwriting`}
          style={{ marginRight: "14px" }}
        >
          <DownloadIcon style={{ marginRight: "4px" }} />
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
                Profile Table ({users.length} total users)
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              {loading ? (
                <MDBox p={2} textAlign="center">
                  Loading...
                </MDBox>
              ) : (
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: pageSize,
                    entries: [5, 10, 15, 20, 25],
                    canChange: true,
                  }}
                  showTotalEntries={true}
                  pagination={{
                    enabled: true,
                    page: page + 1, // Convert 0-based to 1-based for display
                    count: totalPages,
                    onChange: handlePageChange,
                    onEntriesPerPageChange: handleEntriesPerPageChange,
                  }}
                  noEndBorder
                />
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default Tables;
