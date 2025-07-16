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
import CloseIcon from "@mui/icons-material/Close";
import API from "../../../../api/config";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import {
  Alert,
  Snackbar,
  Box,
  Divider,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "assets/theme/base/colors";

// Create a styled wrapper component to override the table header styles
const CustomTableWrapper = styled(Box)({
  "& th": {
    fontFamily: "Poppins, sans-serif !important",
    fontSize: "16px !important",
    fontWeight: "600 !important",
    color: "#000000 !important",
    textTransform: "none !important",
    opacity: "1 !important",
    textAlign: "left !important",
    background: "transparent !important",
    borderBottom: "1px solid #eee !important",
    letterSpacing: "0 !important",
  },
  // Target the specific class you found
  "& .css-w614i4": {
    fontFamily: "Poppins, sans-serif !important",
    fontSize: "16px !important",
    fontWeight: "600 !important",
    color: "#000000 !important",
    textTransform: "none !important",
    opacity: "1 !important",
  },
});

function Tables() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Changed from 8 to 5 items per page
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  // Filter users by search term (name, email, phone, role)
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const phone = user.phone || "";
    const role = user.role || "";
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      phone.toLowerCase().includes(term) ||
      role.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (userId, index) => {
    const actualIndex = indexOfFirstItem + index;
    // Store original data for cancel functionality
    setOriginalUserData({ ...users[actualIndex] });
    setEditingUser(userId);
  };

  const handleCancel = () => {
    if (originalUserData && editingUser) {
      const updatedUsers = [...users];
      const userIndex = updatedUsers.findIndex((user) => user.user_id === editingUser);

      if (userIndex !== -1) {
        updatedUsers[userIndex] = { ...originalUserData };
      }

      setUsers(updatedUsers);
    }

    setEditingUser(null);
    setOriginalUserData(null);
  };

  const handleSave = async (index) => {
    const actualIndex = indexOfFirstItem + index;
    const user = users[actualIndex];
    const token = localStorage.getItem("token");
    const fields = ["name", "email", "phone", "role"];
    let allSuccess = true;

    // Save all fields
    for (const field of fields) {
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
          throw new Error(responseData.message || `Failed to update ${field}`);
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        showNotification(`Error updating ${field}: ${error.message}`, "error");
        allSuccess = false;
      }
    }

    if (allSuccess) {
      showNotification("User updated successfully", "success");
    }

    setEditingUser(null);
    setOriginalUserData(null);
  };

  const handleDelete = async (index) => {
    const actualIndex = indexOfFirstItem + index;
    setUserToDelete({ index, actualIndex });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete == null) return;
    const { actualIndex } = userToDelete;
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
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleView = (userId) => {
    sessionStorage.setItem("selectedUserId", userId);
    navigate(`/admin/profile/profiledetails/${userId}`);
  };

  const handleInputChange = (index, field, value) => {
    const actualIndex = indexOfFirstItem + index;
    const updatedUsers = [...users];
    updatedUsers[actualIndex][field] = value;
    setUsers(updatedUsers);
  };

  // Define a custom component for table headers
  const customHeadComponent = ({ children, ...rest }) => (
    <th
      {...rest}
      style={{
        fontFamily: "Poppins, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#000000",
        textTransform: "none",
        opacity: 1,
        textAlign: "left",
        borderBottom: "1px solid #eee",
      }}
    >
      {children}
    </th>
  );

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      // Adding customHeadProps which might be used by DataTable component
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
    {
      Header: "Email",
      accessor: "email",
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
    {
      Header: "Phone",
      accessor: "phone",
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
    {
      Header: "Role",
      accessor: "role",
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
    {
      Header: "Handwriting",
      accessor: "handwriting",
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
    {
      Header: "Action",
      accessor: "action",
      customHeadProps: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          textTransform: "none",
          opacity: 1,
        },
      },
    },
  ];

  const rows = currentUsers.map((user, index) => ({
    name: (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#555555",
          fontWeight: 400,
        }}
      >
        {editingUser === user.user_id ? (
          <input
            type="text"
            defaultValue={user.name}
            style={{ padding: 5, width: "100%" }}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
          />
        ) : (
          (() => {
            const name = user.name || "N/A";
            if (!searchTerm) return name;
            const idx = name.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (idx === -1) return name;
            const before = name.slice(0, idx);
            const match = name.slice(idx, idx + searchTerm.length);
            const after = name.slice(idx + searchTerm.length);
            return (
              <>
                {before}
                <span
                  style={{
                    background: colors.primary.main + "22",
                    color: colors.primary.main,
                    fontWeight: 700,
                    borderRadius: "4px",
                    padding: "0 2px",
                  }}
                >
                  {match}
                </span>
                {after}
              </>
            );
          })()
        )}
      </Typography>
    ),
    email: (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#555555",
          fontWeight: 400,
        }}
      >
        {editingUser === user.user_id ? (
          <input
            type="email"
            defaultValue={user.email}
            style={{ padding: 5, width: "100%" }}
            onChange={(e) => handleInputChange(index, "email", e.target.value)}
          />
        ) : (
          (() => {
            const email = user.email || "N/A";
            if (!searchTerm) return email;
            const idx = email.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (idx === -1) return email;
            const before = email.slice(0, idx);
            const match = email.slice(idx, idx + searchTerm.length);
            const after = email.slice(idx + searchTerm.length);
            return (
              <>
                {before}
                <span
                  style={{
                    background: colors.primary.main + "22",
                    color: colors.primary.main,
                    fontWeight: 700,
                    borderRadius: "4px",
                    padding: "0 2px",
                  }}
                >
                  {match}
                </span>
                {after}
              </>
            );
          })()
        )}
      </Typography>
    ),
    phone: (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#555555",
          fontWeight: 400,
        }}
      >
        {editingUser === user.user_id ? (
          <input
            type="tel"
            defaultValue={user.phone}
            style={{ padding: 5, width: "100%" }}
            onChange={(e) => handleInputChange(index, "phone", e.target.value)}
          />
        ) : (
          (() => {
            const phone = user.phone || "N/A";
            if (!searchTerm) return phone;
            const idx = phone.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (idx === -1) return phone;
            const before = phone.slice(0, idx);
            const match = phone.slice(idx, idx + searchTerm.length);
            const after = phone.slice(idx + searchTerm.length);
            return (
              <>
                {before}
                <span
                  style={{
                    background: colors.primary.main + "22",
                    color: colors.primary.main,
                    fontWeight: 700,
                    borderRadius: "4px",
                    padding: "0 2px",
                  }}
                >
                  {match}
                </span>
                {after}
              </>
            );
          })()
        )}
      </Typography>
    ),
    role: (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#555555",
          fontWeight: 400,
        }}
      >
        {editingUser === user.user_id ? (
          <input
            type="text"
            defaultValue={user.role}
            style={{ padding: 5, width: "100%" }}
            onChange={(e) => handleInputChange(index, "role", e.target.value)}
          />
        ) : (
          (() => {
            const role = user.role || "N/A";
            if (!searchTerm) return role;
            const idx = role.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (idx === -1) return role;
            const before = role.slice(0, idx);
            const match = role.slice(idx, idx + searchTerm.length);
            const after = role.slice(idx + searchTerm.length);
            return (
              <>
                {before}
                <span
                  style={{
                    background: colors.primary.main + "22",
                    color: colors.primary.main,
                    fontWeight: 700,
                    borderRadius: "4px",
                    padding: "0 2px",
                  }}
                >
                  {match}
                </span>
                {after}
              </>
            );
          })()
        )}
      </Typography>
    ),
    handwriting: (
      <IconButton href={user.report_url} download={`${user.name}.handwriting`} size="small">
        <DownloadIcon />
      </IconButton>
    ),
    action: (
      <Box sx={{ display: "flex", gap: 1 }}>
        {editingUser === user.user_id ? (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleSave(index)}
              sx={{
                backgroundColor: "#4CAF50",
                color: "#FFFFFF",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#f44336",
                color: "#FFFFFF",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleView(user.user_id)}
              sx={{
                backgroundColor: "#f44336",
                color: "#FFFFFF",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
                fontWeight: 400,
                padding: "5px 20px",
                minWidth: "80px",
              }}
            >
              view
            </Button>
            <IconButton onClick={() => handleEdit(user.user_id, index)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(index)} size="small">
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>
    ),
  }));

  return (
    <Card sx={{ borderRadius: "10px", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)" }}>
      {/* Header styled according to Image 2, now with search bar */}
      <Box
        sx={{
          width: "100%",
          padding: "16px",
          borderBottom: "1px solid #eee",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "19px",
            color: "#f44336",
            fontWeight: 700,
            textAlign: "left",
          }}
        >
          Profile Table
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name, email, phone, or role"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          sx={{
            width: 300,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              fontFamily: "Kameron, sans-serif",
              fontSize: "15px",
            },
          }}
          InputProps={{
            style: {
              paddingRight: 0,
            },
          }}
        />
      </Box>

      {loading ? (
        <Box p={2} textAlign="center">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Apply the custom styling wrapper */}
          <CustomTableWrapper sx={{ overflow: "auto" }}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
              // Additional props to customize headers, if the component supports it
              tableHeadProps={{
                sx: {
                  "& th": {
                    fontFamily: "Poppins, sans-serif !important",
                    fontSize: "16px !important",
                    fontWeight: "600 !important",
                    color: "#000000 !important",
                    textTransform: "none !important",
                    opacity: "1 !important",
                  },
                },
              }}
              customHeadCell={customHeadComponent}
            />
          </CustomTableWrapper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderTop: "1px solid #eee",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#555555",
                fontWeight: 400,
              }}
            >
              Page {currentPage} of {totalPages}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                startIcon={<NavigateBeforeIcon />}
                sx={{
                  color: "#666",
                  borderColor: "#ddd",
                  borderRadius: "4px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#ccc",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f5f5f5",
                    color: "#ccc",
                  },
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                endIcon={<NavigateNextIcon />}
                sx={{
                  color: "#666",
                  borderColor: "#ddd",
                  borderRadius: "4px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#ccc",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f5f5f5",
                    color: "#ccc",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" variant="outlined">
            <span style={{ color: "#1976d2" }}>Cancel</span>
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Tables;
