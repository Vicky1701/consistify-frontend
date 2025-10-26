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
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Close,
  Add,
  Save,
  Link as LinkIcon,
  Flag,
  Assignment,
  Code,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Schedule,
} from "@mui/icons-material";
import { createCheckpoint, getConsistencyPaths } from "../../services/api";
import {
  DIFFICULTY_LEVELS,
  SOURCE_PLATFORMS,
  PROBLEM_STATUS,
  DEFAULT_CHECKPOINT,
} from "../../types/checkpoint";

const CheckpointCreateModalNew = ({ open, onClose, onCheckpointCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [consistencyPaths, setConsistencyPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [formData, setFormData] = useState({
    ...DEFAULT_CHECKPOINT,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pathsLoading, setPathsLoading] = useState(false);

  const steps = [
    {
      label: "Select Consistency Path",
      description: "Choose which path this checkpoint belongs to",
    },
    {
      label: "Problem Details",
      description: "Enter the problem information",
    },
    {
      label: "Additional Info",
      description: "Add tags, notes, and time estimate",
    },
  ];

  // Load consistency paths when modal opens
  useEffect(() => {
    if (open) {
      loadConsistencyPaths();
    }
  }, [open]);

  const loadConsistencyPaths = async () => {
    try {
      setPathsLoading(true);
      const response = await getConsistencyPaths();
      setConsistencyPaths(response.data || []);
    } catch (error) {
      setError("Failed to load consistency paths");
      console.error("Error loading paths:", error);
    } finally {
      setPathsLoading(false);
    }
  };

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

  const handleNext = () => {
    if (activeStep === 0 && !selectedPath) {
      setError("Please select a consistency path");
      return;
    }
    if (activeStep === 1 && !validateStep1()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError("");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError("");
  };

  const validateStep1 = () => {
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
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedPath) {
      setError("Please select a consistency path");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const checkpointData = {
        ...formData,
        consistencyPathId: selectedPath.id,
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
    setActiveStep(0);
    setSelectedPath(null);
    setFormData({
      ...DEFAULT_CHECKPOINT,
      tags: [],
    });
    setTagInput("");
    setError("");
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            {pathsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : consistencyPaths.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No consistency paths found. Please create a consistency path
                first.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {consistencyPaths.map((path) => (
                  <Grid item xs={12} sm={6} key={path.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border:
                          selectedPath?.id === path.id
                            ? "2px solid #2563eb"
                            : "1px solid #e0e0e0",
                        "&:hover": { boxShadow: 3 },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setSelectedPath(path)}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                            <Flag />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {path.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {path.targetCount} problems • {path.duration} days
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {path.description || "No description available"}
                        </Typography>
                        {selectedPath?.id === path.id && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              alignItems: "center",
                              color: "success.main",
                            }}
                          >
                            <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2" fontWeight="bold">
                              Selected
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the problem, constraints, and requirements..."
                  required
                />
              </Grid>

              {/* Difficulty and Source Platform */}
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
                    onChange={(e) =>
                      handleSourceChange("platform", e.target.value)
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

              {/* Source URL and Problem ID */}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Problem ID"
                  value={formData.source.problemNumber}
                  onChange={(e) =>
                    handleSourceChange("problemNumber", e.target.value)
                  }
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
                  InputProps={{
                    startAdornment: (
                      <Schedule sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
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
                  rows={4}
                  label="Notes (Optional)"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional notes, hints, or approaches..."
                />
              </Grid>

              {/* Summary */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: "#f8fafc" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Assignment sx={{ mr: 1 }} />
                    Checkpoint Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Consistency Path:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedPath?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Problem Title:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Difficulty:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.difficulty}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Time:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formData.estimatedTime} minutes
                      </Typography>
                    </Grid>
                    {formData.tags.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Tags:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            mt: 0.5,
                          }}
                        >
                          {formData.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "700px",
          maxHeight: "90vh",
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
          Create New Checkpoint
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

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>{renderStepContent(index)}</StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            disabled={loading}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              loading || (activeStep === 0 && consistencyPaths.length === 0)
            }
            endIcon={<ArrowForward />}
            sx={{
              background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
              },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              background: "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #15803d 0%, #16a34a 100%)",
              },
            }}
          >
            {loading ? "Creating..." : "Create Checkpoint"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointCreateModalNew;
