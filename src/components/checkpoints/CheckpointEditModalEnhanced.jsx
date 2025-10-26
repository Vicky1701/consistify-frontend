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
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Tooltip,
  Collapse,
  Divider,
  Tab,
  Tabs,
  Paper,
  Stack,
} from "@mui/material";
import {
  Close,
  Add,
  Save,
  Link as LinkIcon,
  Code,
  Delete,
  Edit,
  Flag,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Assignment,
  Visibility,
  VisibilityOff,
  PlayArrow,
  Speed,
  Memory,
  AccessTime,
  Language,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { updateCheckpoint, getConsistencyPaths } from "../../services/api";
import {
  DIFFICULTY_LEVELS,
  SOURCE_PLATFORMS,
  PROBLEM_STATUS,
  PROGRAMMING_LANGUAGES,
  CODE_TEMPLATES,
} from "../../types/checkpoint";
import CodeEditor from "../shared/CodeEditor";
import {
  COLORS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
  DIFFICULTY_COLORS,
  STATUS_COLORS,
  PLATFORM_COLORS,
} from "../../styles/designSystem";

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Code Solution Card Component
const CodeSolutionCard = ({ solution, index, onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyColor = (complexity) => {
    if (!complexity) return "default";
    if (complexity.includes("O(1)") || complexity.includes("O(log"))
      return "success";
    if (complexity.includes("O(n)")) return "warning";
    return "error";
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 2,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              fontSize: "0.875rem",
            }}
          >
            {solution.language?.charAt(0) || "C"}
          </Avatar>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {solution.title || `Solution ${index + 1}`}
            </Typography>
            <Chip
              label={solution.language || "Unknown"}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            {solution.timeComplexity && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                <Chip
                  label={`Time: ${solution.timeComplexity}`}
                  size="small"
                  color={getDifficultyColor(solution.timeComplexity)}
                  variant="outlined"
                />
              </Box>
            )}
            {solution.spaceComplexity && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Memory sx={{ fontSize: 16, color: "text.secondary" }} />
                <Chip
                  label={`Space: ${solution.spaceComplexity}`}
                  size="small"
                  color={getDifficultyColor(solution.spaceComplexity)}
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        }
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="View Code">
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                color="primary"
              >
                {expanded ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Solution">
              <IconButton size="small" onClick={() => onEdit(solution, index)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Solution">
              <IconButton
                size="small"
                onClick={() => onDelete(solution, index)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          {solution.explanation && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                📝 Explanation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {solution.explanation}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              💻 Code
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 1,
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {solution.code || "No code available"}
              </pre>
            </Paper>
          </Box>
          {solution.notes && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">
                📋 Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {solution.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const CheckpointEditModalEnhanced = ({
  open,
  onClose,
  checkpoint,
  onCheckpointUpdated,
}) => {
  // Tab management
  const [currentTab, setCurrentTab] = useState(0);

  // Form data initialized with checkpoint data
  const [formData, setFormData] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consistencyPaths, setConsistencyPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(false);

  // Code solution management
  const [editingSolution, setEditingSolution] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [newSolution, setNewSolution] = useState({
    title: "",
    language: "JavaScript",
    code: "",
    explanation: "",
    timeComplexity: "",
    spaceComplexity: "",
    notes: "",
  });

  // Initialize form data when checkpoint changes
  useEffect(() => {
    if (checkpoint && open) {
      setFormData({
        id: checkpoint.id,
        title: checkpoint.title || "",
        description: checkpoint.description || "",
        difficulty: checkpoint.difficulty || DIFFICULTY_LEVELS.EASY,
        status: checkpoint.status || PROBLEM_STATUS.NOT_STARTED,
        source: checkpoint.source || {},
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
      source: {
        ...prev.source,
        [field]: value,
      },
      [field === "platform"
        ? "sourcePlatform"
        : field === "url"
        ? "sourceUrl"
        : "sourceProblemNumber"]: value,
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

  // Code solution handlers
  const handleEditSolution = (solution, index) => {
    setEditingSolution({ ...solution, index });
    setNewSolution({
      title: solution.title || "",
      language: solution.language || "JavaScript",
      code: solution.code || "",
      explanation: solution.explanation || "",
      timeComplexity: solution.timeComplexity || "",
      spaceComplexity: solution.spaceComplexity || "",
      notes: solution.notes || "",
    });
    setShowCodeEditor(true);
  };

  const handleDeleteSolution = (solution, index) => {
    setFormData((prev) => ({
      ...prev,
      codeSolutions: prev.codeSolutions.filter((_, i) => i !== index),
    }));
  };

  const handleSaveSolution = () => {
    const updatedSolutions = [...formData.codeSolutions];

    if (editingSolution !== null) {
      // Update existing solution
      updatedSolutions[editingSolution.index] = {
        ...editingSolution,
        ...newSolution,
        id: editingSolution.id || Date.now(),
      };
    } else {
      // Add new solution
      updatedSolutions.push({
        ...newSolution,
        id: Date.now(),
      });
    }

    setFormData((prev) => ({
      ...prev,
      codeSolutions: updatedSolutions,
    }));

    // Reset form
    setEditingSolution(null);
    setShowCodeEditor(false);
    setNewSolution({
      title: "",
      language: "JavaScript",
      code: "",
      explanation: "",
      timeComplexity: "",
      spaceComplexity: "",
      notes: "",
    });
  };

  const handleAddNewSolution = () => {
    setEditingSolution(null);
    setNewSolution({
      title: "",
      language: "JavaScript",
      code: "",
      explanation: "",
      timeComplexity: "",
      spaceComplexity: "",
      notes: "",
    });
    setShowCodeEditor(true);
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
    setCurrentTab(0);
    setShowCodeEditor(false);
    setEditingSolution(null);
    onClose();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!checkpoint) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Assignment />
          <Typography variant="h5" fontWeight="bold">
            Edit Checkpoint
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="checkpoint tabs"
        >
          <Tab
            label="Problem Details"
            icon={<Flag />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            label={`Code Solutions (${formData.codeSolutions?.length || 0})`}
            icon={<Code />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 0, overflow: "auto" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Problem Details Tab */}
        <TabPanel value={currentTab} index={0}>
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
                variant="outlined"
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
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
                variant="outlined"
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
                      <Chip
                        label={level}
                        size="small"
                        color={
                          level === "Easy"
                            ? "success"
                            : level === "Medium"
                            ? "warning"
                            : "error"
                        }
                      />
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
                      <Chip
                        label={status}
                        size="small"
                        color={
                          status === "Completed"
                            ? "success"
                            : status === "In Progress"
                            ? "warning"
                            : "default"
                        }
                      />
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Problem ID"
                value={formData.sourceProblemNumber || ""}
                onChange={(e) =>
                  handleSourceChange("problemNumber", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Problem URL"
                value={formData.sourceUrl || ""}
                onChange={(e) => handleSourceChange("url", e.target.value)}
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
          </Grid>
        </TabPanel>

        {/* Code Solutions Tab */}
        <TabPanel value={currentTab} index={1}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" color="primary">
                Code Solutions ({formData.codeSolutions?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNewSolution}
                sx={{
                  background:
                    "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                  },
                }}
              >
                Add Solution
              </Button>
            </Box>

            {/* Code Solutions List */}
            {formData.codeSolutions && formData.codeSolutions.length > 0 ? (
              <Box>
                {formData.codeSolutions.map((solution, index) => (
                  <CodeSolutionCard
                    key={solution.id || index}
                    solution={solution}
                    index={index}
                    onEdit={handleEditSolution}
                    onDelete={handleDeleteSolution}
                  />
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <Code sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Code Solutions Yet
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 3 }}
                >
                  Add your first code solution to track different approaches for
                  this problem.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddNewSolution}
                  sx={{
                    background:
                      "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                    },
                  }}
                >
                  Add First Solution
                </Button>
              </Paper>
            )}

            {/* Code Editor Dialog */}
            <Dialog
              open={showCodeEditor}
              onClose={() => setShowCodeEditor(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: { minHeight: "70vh" },
              }}
            >
              <DialogTitle>
                {editingSolution
                  ? "Edit Code Solution"
                  : "Add New Code Solution"}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Solution Title"
                      value={newSolution.title}
                      onChange={(e) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Programming Language</InputLabel>
                      <Select
                        value={newSolution.language}
                        label="Programming Language"
                        onChange={(e) =>
                          setNewSolution((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                      >
                        {Object.values(PROGRAMMING_LANGUAGES).map((lang) => (
                          <MenuItem key={lang} value={lang}>
                            {lang}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Code Editor
                    </Typography>
                    <CodeEditor
                      value={newSolution.code}
                      onChange={(value) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          code: value,
                        }))
                      }
                      language={newSolution.language?.toLowerCase()}
                      placeholder={`Enter your ${newSolution.language} solution here...`}
                      minHeight="300px"
                      maxHeight="400px"
                      showHeader={true}
                      title={`${newSolution.language} Solution`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Time Complexity"
                      placeholder="e.g., O(n)"
                      value={newSolution.timeComplexity}
                      onChange={(e) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          timeComplexity: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Space Complexity"
                      placeholder="e.g., O(1)"
                      value={newSolution.spaceComplexity}
                      onChange={(e) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          spaceComplexity: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Explanation"
                      value={newSolution.explanation}
                      onChange={(e) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          explanation: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notes"
                      value={newSolution.notes}
                      onChange={(e) =>
                        setNewSolution((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowCodeEditor(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSaveSolution}
                  startIcon={<Save />}
                >
                  {editingSolution ? "Update Solution" : "Add Solution"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, bgcolor: "grey.50" }}>
        <Button onClick={handleClose} disabled={loading} size="large">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          size="large"
          sx={{
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
            },
            px: 3,
          }}
        >
          {loading ? "Updating..." : "Update Checkpoint"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointEditModalEnhanced;
