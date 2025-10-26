import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Add,
  Save,
  Link as LinkIcon,
  Code,
  Delete,
  Edit,
} from "@mui/icons-material";
import { updateCheckpoint, getConsistencyPaths } from "../../services/api";
import {
  DIFFICULTY_LEVELS,
  SOURCE_PLATFORMS,
  PROBLEM_STATUS,
  PROGRAMMING_LANGUAGES,
  CODE_TEMPLATES,
} from "../../types/checkpoint";

const CheckpointEditModal = ({
  open,
  onClose,
  checkpoint,
  onCheckpointUpdated,
}) => {
  // Form data initialized with checkpoint data
  const [formData, setFormData] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consistencyPaths, setConsistencyPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(false);

  // Initialize form data when checkpoint changes
  useEffect(() => {
    if (checkpoint && open) {
      setFormData({
        id: checkpoint.id,
        title: checkpoint.title || "",
        description: checkpoint.description || "",
        difficulty: checkpoint.difficulty || DIFFICULTY_LEVELS.EASY,
        status: checkpoint.status || PROBLEM_STATUS.NOT_STARTED,
        source: checkpoint.source || "",
        sourcePlatform: checkpoint.sourcePlatform || "",
        sourceUrl: checkpoint.sourceUrl || "",
        sourceProblemNumber: checkpoint.sourceProblemNumber || "",
        estimatedTime: checkpoint.estimatedTime || 30,
        tags: checkpoint.tags || [],
        notes: checkpoint.notes || "",
        code: checkpoint.code || "",
        consistencyPathId: checkpoint.consistencyPathId || "",
        codeSolutions: checkpoint.codeSolutions || [],
      });
    }
  }, [checkpoint, open]);

  // Load consistency paths
  useEffect(() => {
    if (open) {
      loadConsistencyPaths();
    }
  }, [open]);

  const loadConsistencyPaths = async () => {
    try {
      setLoadingPaths(true);
      const response = await getConsistencyPaths();
      setConsistencyPaths(response.data || []);
    } catch (error) {
      console.error("Error loading consistency paths:", error);
      setError("Failed to load consistency paths");
    } finally {
      setLoadingPaths(false);
    }
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSourceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Tag handlers
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

  // Validation
  const validateForm = () => {
    if (!formData.title?.trim()) {
      setError("Problem title is required");
      return false;
    }
    if (!formData.description?.trim()) {
      setError("Problem description is required");
      return false;
    }
    if (!formData.difficulty) {
      setError("Difficulty level is required");
      return false;
    }
    if (!formData.consistencyPathId) {
      setError("Consistency Path is required");
      return false;
    }
    setError("");
    return true;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const response = await updateCheckpoint(formData.id, formData);
      onCheckpointUpdated(response.data);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update checkpoint");
      console.error("Error updating checkpoint:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTagInput("");
    setError("");
    onClose();
  };

  if (!checkpoint) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "70vh",
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
          Edit Checkpoint
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
          {/* Consistency Path Selection */}
          <Grid item xs={12}>
            {loadingPaths ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <FormControl fullWidth required>
                <InputLabel>Consistency Path</InputLabel>
                <Select
                  value={formData.consistencyPathId || ""}
                  label="Consistency Path"
                  onChange={(e) =>
                    handleInputChange("consistencyPathId", e.target.value)
                  }
                >
                  {consistencyPaths.map((path) => (
                    <MenuItem key={path.id} value={path.id}>
                      {path.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {/* Problem Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problem Title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </Grid>

          {/* Difficulty and Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formData.difficulty || ""}
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
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ""}
                label="Status"
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {Object.values(PROBLEM_STATUS).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Source Platform and URL */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Source Platform</InputLabel>
              <Select
                value={formData.sourcePlatform || ""}
                label="Source Platform"
                onChange={(e) =>
                  handleSourceChange("sourcePlatform", e.target.value)
                }
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Problem ID"
              value={formData.sourceProblemNumber || ""}
              onChange={(e) =>
                handleSourceChange("sourceProblemNumber", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problem URL"
              value={formData.sourceUrl || ""}
              onChange={(e) => handleSourceChange("sourceUrl", e.target.value)}
              InputProps={{
                startAdornment: (
                  <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          {/* Time Estimate */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time Estimate (minutes)"
              type="number"
              value={formData.estimatedTime || 0}
              onChange={(e) =>
                handleInputChange(
                  "estimatedTime",
                  parseInt(e.target.value) || 0
                )
              }
              inputProps={{ min: 0, max: 480 }}
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {formData.tags?.map((tag, index) => (
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
                placeholder="Add a tag"
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
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </Grid>

          {/* Code Solutions Display */}
          {formData.codeSolutions && formData.codeSolutions.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={`Code Solutions (${formData.codeSolutions.length})`}
                  subheader="Existing solutions for this checkpoint"
                />
                <CardContent sx={{ pt: 0 }}>
                  <List>
                    {formData.codeSolutions.map((solution, index) => (
                      <ListItem key={solution.id || index} divider>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={solution.language}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Typography variant="subtitle2">
                                {solution.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {solution.timeComplexity && (
                                <Typography variant="caption" sx={{ mr: 2 }}>
                                  Time: {solution.timeComplexity}
                                </Typography>
                              )}
                              {solution.spaceComplexity && (
                                <Typography variant="caption">
                                  Space: {solution.spaceComplexity}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
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
          {loading ? "Updating..." : "Update Checkpoint"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointEditModal;
