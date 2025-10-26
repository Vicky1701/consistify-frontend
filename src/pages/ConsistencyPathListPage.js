/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add,
  Search,
  FilterList,
  SortByAlpha,
  CalendarToday,
  Refresh,
} from "@mui/icons-material";
import AppLayout from "../components/shared/AppLayout";
import PathCreateForm from "../components/consistency-paths/PathCreateForm";
import PathEditForm from "../components/consistency-paths/PathEditForm";
import PathListItem from "../components/consistency-paths/PathListItem";
import PathDetailModal from "../components/consistency-paths/PathDetailModal";
import { getConsistencyPaths } from "../services/api";
import "../styles/ConsistencyPaths.css";

const ConsistencyPathListPage = () => {
  // State management
  const [paths, setPaths] = useState([]);
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [error, setError] = useState("");

  // Load paths on component mount
  useEffect(() => {
    loadPaths();
  }, []);

  // Filter and sort paths when dependencies change
  useEffect(() => {
    filterAndSortPaths();
  }, [paths, searchTerm, sortBy, filterBy]); // filterAndSortPaths is stable

  const loadPaths = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getConsistencyPaths();
      setPaths(response.data || []);
    } catch (error) {
      setError("Failed to load consistency paths. Please try again.");
      console.error("Error loading paths:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPaths = () => {
    let filtered = [...paths];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((path) =>
        path.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter (you can extend this based on your needs)
    if (filterBy !== "all") {
      switch (filterBy) {
        case "short":
          filtered = filtered.filter((path) => path.durationDays <= 7);
          break;
        case "medium":
          filtered = filtered.filter(
            (path) => path.durationDays > 7 && path.durationDays <= 30
          );
          break;
        case "long":
          filtered = filtered.filter((path) => path.durationDays > 30);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "duration":
          return a.durationDays - b.durationDays;
        case "target":
          return a.dailyTarget - b.dailyTarget;
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredPaths(filtered);
  };

  const handleCreateSuccess = (newPath) => {
    setPaths((prev) => [...prev, newPath]);
    setCreateModalOpen(false);
    showSnackbar("Consistency Path created successfully!", "success");
  };

  const handleEditSuccess = (updatedPath) => {
    setPaths((prev) =>
      prev.map((path) => (path.id === updatedPath.id ? updatedPath : path))
    );
    setEditModalOpen(false);
    setSelectedPath(null);
    showSnackbar("Consistency Path updated successfully!", "success");
  };

  const handleDelete = (pathId) => {
    setPaths((prev) => prev.filter((path) => path.id !== pathId));
    showSnackbar("Consistency Path deleted successfully!", "success");
  };

  const handleEdit = (path) => {
    setSelectedPath(path);
    setEditModalOpen(true);
  };

  const handleViewDetails = (path) => {
    setSelectedPath(path);
    setDetailModalOpen(true);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCreateError = (errorMessage) => {
    showSnackbar(errorMessage, "error");
  };

  const handleEditError = (errorMessage) => {
    showSnackbar(errorMessage, "error");
  };

  return (
    <AppLayout title="Consistency Paths">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              Your Consistency Paths
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                },
                borderRadius: 2,
                px: 3,
              }}
            >
              Create New Path
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Track your DSA practice journey with customizable consistency paths.
            Set goals, monitor progress, and build lasting habits.
          </Typography>

          {/* Search and Filter Controls */}
          <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    startAdornment={<SortByAlpha sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                    <MenuItem value="target">Daily Target</MenuItem>
                    <MenuItem value="created">Created Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter By</InputLabel>
                  <Select
                    value={filterBy}
                    label="Filter By"
                    onChange={(e) => setFilterBy(e.target.value)}
                    startAdornment={<FilterList sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="all">All Paths</MenuItem>
                    <MenuItem value="short">Short (≤7 days)</MenuItem>
                    <MenuItem value="medium">Medium (8-30 days)</MenuItem>
                    <MenuItem value="long">Long (&gt;30 days)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={loadPaths}
                  startIcon={<Refresh />}
                  size="small"
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Stats Summary */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Chip
              label={`${paths.length} Total Paths`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${filteredPaths.length} Showing`}
              color="secondary"
              variant="outlined"
            />
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                color="info"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          /* Content Area */
          <>
            {filteredPaths.length === 0 ? (
              <Card
                sx={{
                  textAlign: "center",
                  py: 8,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                }}
              >
                <CardContent>
                  <CalendarToday
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    {searchTerm ? "No paths found" : "No consistency paths yet"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {searchTerm
                      ? `No paths match "${searchTerm}". Try a different search term.`
                      : "Start your DSA consistency journey by creating your first path."}
                  </Typography>
                  {!searchTerm && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => setCreateModalOpen(true)}
                      sx={{
                        background:
                          "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                        },
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Create Your First Path
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {filteredPaths.map((path) => (
                  <Grid item xs={12} sm={6} lg={4} key={path.id}>
                    <PathListItem
                      path={path}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setCreateModalOpen(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", md: "none" },
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
            },
          }}
        >
          <Add />
        </Fab>
      </Box>

      {/* Create Path Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <PathCreateForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setCreateModalOpen(false)}
          onError={handleCreateError}
        />
      </Dialog>

      {/* Edit Path Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPath(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <PathEditForm
          path={selectedPath}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedPath(null);
          }}
          onError={handleEditError}
        />
      </Dialog>

      {/* Path Detail Modal */}
      <PathDetailModal
        open={detailModalOpen}
        path={selectedPath}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPath(null);
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default ConsistencyPathListPage;
