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

function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalCompanies, setTotalCompanies] = useState(0);

  const navigate = useNavigate();

  // Fetch companies data
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCompanies = async () => {
      setLoading(true);
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
        setCompanies(data);
        setTotalCompanies(data.length);
      } catch (error) {
        console.error("Error fetching companies:", error);
        alert("Failed to load company data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle view click
  const handleViewClick = (companyId) => {
    sessionStorage.setItem("selectedCompanyId", companyId);
    navigate("/admin/profile");
  };

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return companies.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCompanies / itemsPerPage));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        {/* Table Header */}
        <div
          style={{
            backgroundColor: "white",
            padding: "15px 20px",
            borderBottom: "3px solid #D9D9D9",
            textAlign: "center", // Center the title
          }}
        >
          <MDTypography
            variant="h6"
            color="error"
            fontWeight="bold"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
            }}
          >
            Company Table
          </MDTypography>
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
                        padding: "12px 15px",
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Candidate
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "left",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "regular",
                        color: "#000000",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Employee
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
                        {company.company_name || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "15px",
                          fontFamily: "Kameron, sans-serif",
                          fontWeight: "normal",
                          color: "#555555",
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
    </div>
  );
}

export default CompanyTable;
