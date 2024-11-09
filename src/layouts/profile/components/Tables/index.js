import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import API from "../../../../api/config";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Alert, Snackbar } from "@mui/material";

function Tables() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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
        showNotification("Error fetching users: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (index, field) => {
    const actualIndex = indexOfFirstItem + index;
    const updatedUsers = [...users];
    updatedUsers[actualIndex].isEditing[field] = true;
    setUsers(updatedUsers);
  };

  const handleSave = async (index, field) => {
    const actualIndex = indexOfFirstItem + index;
    const user = users[actualIndex];
    const token = localStorage.getItem("token");

    // For debugging
    console.log("Saving user data:", {
      userId: user.user_id,
      field,
      value: user[field],
    });

    try {
      const response = await fetch(`${API}company/users/${user.user_id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: field,
          value: user[field],
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update user");
      }

      const updatedUsers = [...users];
      updatedUsers[actualIndex].isEditing[field] = false;
      setUsers(updatedUsers);
      showNotification("User updated successfully", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("Error updating user: " + error.message, "error");
      // Optionally revert the local change
      const updatedUsers = [...users];
      updatedUsers[actualIndex][field] = user[field];
      setUsers(updatedUsers);
    }
  };

  const handleDelete = async (index) => {
    const actualIndex = indexOfFirstItem + index;
    const user = users[actualIndex];
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API}company/users/${user.user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const updatedUsers = users.filter((_, i) => i !== actualIndex);
      setUsers(updatedUsers);
      showNotification("User deleted successfully", "success");
    } catch (error) {
      showNotification("Error deleting user: " + error.message, "error");
    }
  };

  const handleView = (userId) => {
    sessionStorage.setItem("selectedUserId", userId);
    navigate(`/admin/profile/profiledetails/${userId}`);
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Role", accessor: "role" },
    { Header: "Actions", accessor: "actions" },
  ];

  const rows = currentUsers.map((user, index) => ({
    name: (
      <>
        {user.isEditing.name ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              defaultValue={user.name}
              style={{ padding: 5 }}
              onChange={(e) => {
                const updatedUsers = [...users];
                const actualIndex = indexOfFirstItem + index;
                updatedUsers[actualIndex].name = e.target.value;
                setUsers(updatedUsers);
              }}
            />
            <Button size="small" onClick={() => handleSave(index, "name")}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {user.name}
            <IconButton onClick={() => handleEdit(index, "name")}>
              <EditIcon />
            </IconButton>
          </div>
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
                const updatedUsers = [...users];
                const actualIndex = indexOfFirstItem + index;
                updatedUsers[actualIndex].email = e.target.value;
                setUsers(updatedUsers);
              }}
            />
            <Button size="small" onClick={() => handleSave(index, "email")}>
              Save
            </Button>
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
                const updatedUsers = [...users];
                const actualIndex = indexOfFirstItem + index;
                updatedUsers[actualIndex].phone = e.target.value;
                setUsers(updatedUsers);
              }}
            />
            <Button size="small" onClick={() => handleSave(index, "phone")}>
              Save
            </Button>
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
                const updatedUsers = [...users];
                const actualIndex = indexOfFirstItem + index;
                updatedUsers[actualIndex].role = e.target.value;
                setUsers(updatedUsers);
              }}
            />
            <Button size="small" onClick={() => handleSave(index, "role")}>
              Save
            </Button>
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
          style={{ marginRight: "8px" }}
          startIcon={<DownloadIcon />}
          size="small"
        >
          Handwriting
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => handleView(user.user_id)}
          style={{ marginRight: "8px" }}
          size="small"
        >
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
                <>
                  <div style={{ height: "500px", overflow: "auto" }}>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={true}
                      noEndBorder
                    />
                  </div>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <MDTypography variant="button" color="text">
                      Page {currentPage} of {totalPages}
                    </MDTypography>
                    <MDBox display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        startIcon={<NavigateBeforeIcon />}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        endIcon={<NavigateNextIcon />}
                      >
                        Next
                      </Button>
                    </MDBox>
                  </MDBox>
                </>
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </MDBox>
  );
}

export default Tables;
