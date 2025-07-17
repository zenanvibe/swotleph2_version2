import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import API from "../../../../../api/config";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import colors from "assets/theme/base/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // <-- Add search term state
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  // Fetch companies data (move outside useEffect for global access)
  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`${API}company`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch company data");
      const data = await response.json();
      setCompanies(data);
      setTotalCompanies(data.length);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to load company data.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies by search term
  const filteredCompanies = companies.filter(
    (company) =>
      company.company_name && company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated data (use filteredCompanies)
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  };

  // Calculate total pages (use filteredCompanies)
  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view click
  const handleViewClick = (companyId) => {
    sessionStorage.setItem("selectedCompanyId", companyId);
    navigate("/admin/profile");
  };

  // Edit handlers
  const handleEditClick = (company) => {
    setEditCompanyId(company.company_id);
    setEditCompanyName(company.company_name);
  };
  const handleEditCancel = () => {
    setEditCompanyId(null);
    setEditCompanyName("");
  };
  const handleEditSave = async (company) => {
    setActionLoading(true);
    const token = localStorage.getItem("token");
    try {
      const putResponse = await fetch(`${API}company/${company.company_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ company_name: editCompanyName }),
      });
      if (!putResponse.ok) throw new Error("Failed to update company");
      setSnackbar({ open: true, message: "Company edited!", severity: "success" });
      setEditCompanyId(null);
      setEditCompanyName("");
      fetchCompanies();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };
  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    setActionLoading(true);
    const token = localStorage.getItem("token");
    try {
      const deleteResponse = await fetch(`${API}company/${companyToDelete.company_id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!deleteResponse.ok) throw new Error("Failed to delete company");
      setSnackbar({ open: true, message: "Company deleted!", severity: "success" });
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
      fetchCompanies();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{}}>
      <Card
        sx={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "17px",
          overflow: "hidden",
          maxWidth: "1200px",
          margin: "0 auto", // Center the table
        }}
      >
        {/* Search Bar */}
        {/* Table Header */}
        <div
          style={{
            backgroundColor: "white",
            padding: "15px 20px",
            borderBottom: "3px solid #D9D9D9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MDTypography
            variant="h6"
            color="error"
            fontWeight="bold"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              textAlign: "left",
            }}
          >
            Company Table
          </MDTypography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by company name..."
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
        </div>

        {/* Table Content */}
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress color="error" />
          </MDBox>
        ) : (
          <div
            style={{
              overflowX: "auto", // Add horizontal scroll for mobile
              padding: "0 10px",
            }}
          >
            <div
              style={{
                maxHeight: "500px", // Increased height to show more rows
                overflowY: "auto", // Make it scrollable vertically
                marginBottom: "10px", // Reduced gap below content
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                  <tr>
                    <th
                      style={{
                        padding: "12px 15px", // Slightly reduced padding
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee", // Add border for better separation
                      }}
                    >
                      Company
                    </th>
                    <th
                      style={{
                        padding: "12px 15px", // Slightly reduced padding
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee", // Add border for better separation
                      }}
                    >
                      Interview Candidate
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Exisiting Employee
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((company) => (
                    <tr key={company.company_id}>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                        }}
                      >
                        {/* Highlight search term in company name or edit mode */}
                        {editCompanyId === company.company_id ? (
                          <TextField
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            size="small"
                            autoFocus
                            sx={{ width: 180 }}
                          />
                        ) : (
                          (() => {
                            const name = company.company_name || "N/A";
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
                                    background: colors.primary.main + "22", // subtle highlight
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
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                          textAlign: "center",
                        }}
                      >
                        {company.number_of_candidates || "0"}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
                          textAlign: "center",
                        }}
                      >
                        {company.number_of_employees || "0"}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            backgroundColor: "#E4003A",
                            color: "white",
                            textTransform: "none",
                            fontSize: "10px",
                            fontWeight: "regular",
                            fontFamily: "Kameron, sans-serif",
                            borderRadius: "7px",
                            padding: "3px 10px",
                          }}
                          onClick={() => handleViewClick(company.company_id)}
                        >
                          View
                        </Button>
                        {editCompanyId === company.company_id ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleEditSave(company)}
                              disabled={actionLoading}
                              sx={{
                                backgroundColor: "#4CAF50",
                                color: "#FFFFFF",
                                borderRadius: "4px",
                                textTransform: "none",
                                fontWeight: 400,
                                ml: 1,
                                minWidth: "60px",
                                "&:hover": { backgroundColor: "#45a049" },
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={handleEditCancel}
                              disabled={actionLoading}
                              sx={{
                                backgroundColor: "#f44336",
                                color: "#FFFFFF",
                                borderRadius: "4px",
                                textTransform: "none",
                                fontWeight: 400,
                                ml: 1,
                                minWidth: "60px",
                                "&:hover": { backgroundColor: "#d32f2f" },
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              style={{ marginLeft: 4 }}
                              onClick={() => handleEditClick(company)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              style={{ marginLeft: 2 }}
                              onClick={() => handleDeleteClick(company)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Page {currentPage} of {totalPages}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              startIcon={<NavigateBeforeIcon />}
              sx={{
                borderColor: "#ccc",
                color: "#555",
                textTransform: "none",
                fontFamily: "Kameron, sans-serif",
                fontSize: "12px",
                "&:hover": {
                  borderColor: "#E4003A",
                  color: "#E4003A",
                },
                "&.Mui-disabled": {
                  color: "#ccc",
                  borderColor: "#eee",
                },
              }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              endIcon={<NavigateNextIcon />}
              sx={{
                borderColor: "#ccc",
                color: "#555",
                textTransform: "none",
                fontFamily: "Kameron, sans-serif",
                fontSize: "12px",
                "&:hover": {
                  borderColor: "#E4003A",
                  color: "#E4003A",
                },
                "&.Mui-disabled": {
                  color: "#ccc",
                  borderColor: "#eee",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this company? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            variant="outlined"
            disabled={actionLoading}
            style={{ color: "#1976d2" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default CompanyTable;
