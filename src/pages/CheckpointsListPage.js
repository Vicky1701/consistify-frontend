import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Fab,
  Alert,
  Skeleton,
} from "@mui/material";
import { Add, Search, FilterList, Code, Assignment } from "@mui/icons-material";
import AppLayout from "../components/shared/AppLayout";
import CheckpointListItem from "../components/checkpoints/CheckpointListItem.jsx";
import CheckpointCreateModalEnhanced from "../components/checkpoints/CheckpointCreateModalEnhanced.jsx";
import CheckpointEditModalEnhanced from "../components/checkpoints/CheckpointEditModalEnhanced.jsx";
import {
  getAllCheckpoints,
  updateCheckpoint,
  deleteCheckpoint,
} from "../services/api";
import {
  DIFFICULTY_LEVELS,
  PROBLEM_STATUS,
  SOURCE_PLATFORMS,
} from "../types/checkpoint";

const CheckpointsListPage = () => {
  // State management
  const [checkpoints, setCheckpoints] = useState([]);
  const [filteredCheckpoints, setFilteredCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  // Load checkpoints on component mount
  useEffect(() => {
    loadCheckpoints();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...checkpoints];

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(
        (checkpoint) =>
          checkpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checkpoint.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (checkpoint) => checkpoint.difficulty === difficultyFilter
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (checkpoint) => checkpoint.status === statusFilter
      );
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(
        (checkpoint) => checkpoint.source.platform === sourceFilter
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((checkpoint) =>
        selectedTags.every((tag) => checkpoint.tags.includes(tag))
      );
    }

    setFilteredCheckpoints(filtered);
  }, [
    checkpoints,
    searchTerm,
    difficultyFilter,
    statusFilter,
    sourceFilter,
    selectedTags,
  ]);

  // Apply filters when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadCheckpoints = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllCheckpoints();
      setCheckpoints(response.data || []);
    } catch (error) {
      setError("Failed to load checkpoints. Please try again.");
      console.error("Error loading checkpoints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckpointCreated = (newCheckpoint) => {
    setCheckpoints((prev) => [newCheckpoint, ...prev]);
    setCreateModalOpen(false);
  };

  const handleCheckpointDeleted = async (deletedId) => {
    try {
      await deleteCheckpoint(deletedId);
      setCheckpoints((prev) => prev.filter((cp) => cp.id !== deletedId));
    } catch (error) {
      setError("Failed to delete checkpoint");
      console.error("Error deleting checkpoint:", error);
    }
  };

  const handleCheckpointUpdated = async (updatedCheckpoint) => {
    try {
      const response = await updateCheckpoint(
        updatedCheckpoint.id,
        updatedCheckpoint
      );
      setCheckpoints((prev) =>
        prev.map((cp) => (cp.id === updatedCheckpoint.id ? response.data : cp))
      );
    } catch (error) {
      setError("Failed to update checkpoint");
      console.error("Error updating checkpoint:", error);
    }
  };

  const handleCheckpointEdit = (checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setEditModalOpen(true);
  };

  const handleEditModalUpdated = (updatedCheckpoint) => {
    setCheckpoints((prev) =>
      prev.map((cp) =>
        cp.id === updatedCheckpoint.id ? updatedCheckpoint : cp
      )
    );
    setEditModalOpen(false);
    setSelectedCheckpoint(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setSourceFilter("all");
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <AppLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Checkpoints (Problem Logging)
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Assignment sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Checkpoints
            </Typography>
            <Chip
              label={`${filteredCheckpoints.length} problems`}
              color="primary"
              variant="outlined"
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
              },
            }}
          >
            Add Checkpoint
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <FilterList />
            <Typography variant="h6">Filters & Search</Typography>
            <Button size="small" onClick={clearFilters} sx={{ ml: "auto" }}>
              Clear All
            </Button>
          </Box>

          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search checkpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Difficulty Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficultyFilter}
                  label="Difficulty"
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {Object.values(DIFFICULTY_LEVELS).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {Object.values(PROBLEM_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Source Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={sourceFilter}
                  label="Source"
                  onChange={(e) => setSourceFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {Object.values(SOURCE_PLATFORMS).map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Checkpoints Grid */}
        {filteredCheckpoints.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Code sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {checkpoints.length === 0
                ? "No checkpoints yet"
                : "No checkpoints match your filters"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {checkpoints.length === 0
                ? "Start by adding your first problem checkpoint!"
                : "Try adjusting your search and filter criteria"}
            </Typography>
            {checkpoints.length === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateModalOpen(true)}
              >
                Add Your First Checkpoint
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCheckpoints.map((checkpoint) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={checkpoint.id}>
                <CheckpointListItem
                  checkpoint={checkpoint}
                  onDelete={handleCheckpointDeleted}
                  onUpdate={handleCheckpointUpdated}
                  onEdit={handleCheckpointEdit}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add checkpoint"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
            },
          }}
          onClick={() => setCreateModalOpen(true)}
        >
          <Add />
        </Fab>

        {/* Create Checkpoint Modal */}
        <CheckpointCreateModalEnhanced
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCheckpointCreated={handleCheckpointCreated}
        />

        {/* Edit Checkpoint Modal */}
        <CheckpointEditModalEnhanced
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedCheckpoint(null);
          }}
          checkpoint={selectedCheckpoint}
          onCheckpointUpdated={handleEditModalUpdated}
        />
      </Box>
    </AppLayout>
  );
};

export default CheckpointsListPage;
