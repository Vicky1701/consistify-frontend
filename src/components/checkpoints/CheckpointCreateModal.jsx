import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Grid,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close, Add, Save, Link as LinkIcon } from "@mui/icons-material";
import { createCheckpoint } from "../../services/api";
import {
  DIFFICULTY_LEVELS,
  SOURCE_PLATFORMS,
  PROBLEM_STATUS,
  DEFAULT_CHECKPOINT,
} from "../../types/checkpoint";

const CheckpointCreateModal = ({ open, onClose, onCheckpointCreated }) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_CHECKPOINT,
    description: "",
    estimatedTime: 30,
    tags: [],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSourceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      source: {
        ...prev.source,
        [field]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Problem title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Problem description is required");
      return false;
    }
    if (!formData.difficulty) {
      setError("Difficulty level is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const checkpointData = {
        ...formData,
        status: PROBLEM_STATUS.NOT_STARTED,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await createCheckpoint(checkpointData);
      onCheckpointCreated(response.data);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create checkpoint");
      console.error("Error creating checkpoint:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ...DEFAULT_CHECKPOINT,
      description: "",
      estimatedTime: 30,
      tags: [],
      notes: "",
    });
    setTagInput("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Add New Checkpoint
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Problem Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problem Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Two Sum, Binary Tree Traversal"
              required
            />
          </Grid>

          {/* Problem Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Problem Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the problem, constraints, and requirements..."
              required
            />
          </Grid>

          {/* Difficulty and Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formData.difficulty}
                label="Difficulty"
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
              >
                {Object.values(DIFFICULTY_LEVELS).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Source Platform</InputLabel>
              <Select
                value={formData.source.platform}
                label="Source Platform"
                onChange={(e) => handleSourceChange("platform", e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {Object.values(SOURCE_PLATFORMS).map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Source URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problem URL"
              value={formData.source.url}
              onChange={(e) => handleSourceChange("url", e.target.value)}
              placeholder="https://leetcode.com/problems/two-sum"
              InputProps={{
                startAdornment: (
                  <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          {/* Problem ID */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Problem ID"
              value={formData.source.problemId}
              onChange={(e) => handleSourceChange("problemId", e.target.value)}
              placeholder="e.g., 1, 104, two-sum"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time Estimate (minutes)"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) =>
                handleInputChange(
                  "estimatedTime",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="30"
              inputProps={{ min: 0, max: 480 }}
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a tag (e.g., array, binary-tree, dynamic-programming)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                startIcon={<Add />}
              >
                Add
              </Button>
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional notes, hints, or approaches..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          sx={{
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
            },
          }}
        >
          {loading ? "Creating..." : "Create Checkpoint"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointCreateModal;
