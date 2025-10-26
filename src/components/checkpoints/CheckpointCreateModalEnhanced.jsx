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
  Stepper,
  Step,
  StepLabel,
  Avatar,
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
  Flag,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Assignment,
} from "@mui/icons-material";
import { createCheckpoint, getConsistencyPaths } from "../../services/api";
import {
  DIFFICULTY_LEVELS,
  SOURCE_PLATFORMS,
  PROBLEM_STATUS,
  PROGRAMMING_LANGUAGES,
  CODE_TEMPLATES,
  DEFAULT_CHECKPOINT,
} from "../../types/checkpoint";
import CodeEditor from "../shared/CodeEditor";
import {
  COLORS,
  SHADOWS,
  BORDER_RADIUS,
  DIFFICULTY_COLORS,
} from "../../styles/designSystem";

const CheckpointCreateModalEnhanced = ({
  open,
  onClose,
  onCheckpointCreated,
}) => {
  // Main form data
  const [formData, setFormData] = useState({
    ...DEFAULT_CHECKPOINT,
    description: "",
    estimatedTime: 30,
    tags: [],
    notes: "",
    consistencyPathId: "",
    codeSolutions: [],
  });

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  // Code editor state
  const [currentSolution, setCurrentSolution] = useState({
    id: Date.now(),
    title: "",
    language: PROGRAMMING_LANGUAGES.JAVA,
    code: CODE_TEMPLATES[PROGRAMMING_LANGUAGES.JAVA],
    timeComplexity: "",
    spaceComplexity: "",
    approach: "",
    createdAt: new Date().toISOString(),
  });
  const [editingSolutionIndex, setEditingSolutionIndex] = useState(-1);

  // Other state
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consistencyPaths, setConsistencyPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(false);

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

  // Code solution handlers
  const handleSolutionChange = (field, value) => {
    setCurrentSolution((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageChange = (language) => {
    setCurrentSolution((prev) => ({
      ...prev,
      language,
      code:
        prev.code === CODE_TEMPLATES[prev.language]
          ? CODE_TEMPLATES[language]
          : prev.code,
    }));
  };

  const handleSaveSolution = () => {
    if (!currentSolution.title.trim()) {
      setError("Solution title is required");
      return;
    }
    if (!currentSolution.code.trim()) {
      setError("Code is required");
      return;
    }

    const solutionToSave = {
      ...currentSolution,
      id:
        editingSolutionIndex >= 0
          ? formData.codeSolutions[editingSolutionIndex].id
          : Date.now(),
    };

    if (editingSolutionIndex >= 0) {
      // Update existing solution
      const updatedSolutions = [...formData.codeSolutions];
      updatedSolutions[editingSolutionIndex] = solutionToSave;
      setFormData((prev) => ({ ...prev, codeSolutions: updatedSolutions }));
    } else {
      // Add new solution
      setFormData((prev) => ({
        ...prev,
        codeSolutions: [...prev.codeSolutions, solutionToSave],
      }));
    }

    // Reset current solution
    setCurrentSolution({
      id: Date.now(),
      title: "",
      language: PROGRAMMING_LANGUAGES.JAVA,
      code: CODE_TEMPLATES[PROGRAMMING_LANGUAGES.JAVA],
      timeComplexity: "",
      spaceComplexity: "",
      approach: "",
      createdAt: new Date().toISOString(),
    });
    setEditingSolutionIndex(-1);
    setError("");
  };

  const handleEditSolution = (index) => {
    setCurrentSolution(formData.codeSolutions[index]);
    setEditingSolutionIndex(index);
  };

  const handleDeleteSolution = (index) => {
    const updatedSolutions = formData.codeSolutions.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, codeSolutions: updatedSolutions }));
  };

  const handleCancelEdit = () => {
    setCurrentSolution({
      id: Date.now(),
      title: "",
      language: PROGRAMMING_LANGUAGES.JAVA,
      code: CODE_TEMPLATES[PROGRAMMING_LANGUAGES.JAVA],
      timeComplexity: "",
      spaceComplexity: "",
      approach: "",
      createdAt: new Date().toISOString(),
    });
    setEditingSolutionIndex(-1);
    setError("");
  };

  // Stepper handlers
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  // Validation
  const validateBasicInfo = () => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.difficulty &&
      formData.consistencyPathId
    );
  };

  const validateForm = () => {
    if (!validateBasicInfo()) {
      setError(
        "Please fill in all required fields in the Problem Details step"
      );
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
      consistencyPathId: "",
      codeSolutions: [],
    });
    setCurrentSolution({
      id: Date.now(),
      title: "",
      language: PROGRAMMING_LANGUAGES.JAVA,
      code: CODE_TEMPLATES[PROGRAMMING_LANGUAGES.JAVA],
      timeComplexity: "",
      spaceComplexity: "",
      approach: "",
      createdAt: new Date().toISOString(),
    });
    setTagInput("");
    setError("");
    setActiveStep(0);
    setEditingSolutionIndex(-1);
    setCompleted({});
    onClose();
  };

  const steps = [
    {
      label: "Problem Details",
      icon: <Assignment />,
      optional: false,
    },
    {
      label: "Code Solutions",
      icon: <Code />,
      optional: true,
    },
    {
      label: "Review & Save",
      icon: <CheckCircle />,
      optional: false,
    },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderProblemDetailsStep();
      case 1:
        return renderCodeSolutionsStep();
      case 2:
        return renderReviewStep();
      default:
        return null;
    }
  };

  const renderProblemDetailsStep = () => (
    <Grid container spacing={3}>
      {/* Consistency Path Selection */}
      <Grid item xs={12}>
        <Card sx={{ mb: 2, border: "2px solid #e3f2fd" }}>
          <CardHeader
            avatar={<Flag color="primary" />}
            title="Select Consistency Path"
            subheader="Choose which consistency path this checkpoint belongs to"
          />
          <CardContent>
            {loadingPaths ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <FormControl fullWidth required>
                <InputLabel>Consistency Path</InputLabel>
                <Select
                  value={formData.consistencyPathId}
                  label="Consistency Path"
                  onChange={(e) =>
                    handleInputChange("consistencyPathId", e.target.value)
                  }
                >
                  {consistencyPaths.map((path) => (
                    <MenuItem key={path.id} value={path.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                          }}
                        >
                          {path.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{path.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {path.checkpoints?.length || 0} checkpoints
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </CardContent>
        </Card>
      </Grid>

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

      {/* Difficulty and Time Estimate */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={formData.difficulty}
            label="Difficulty"
            onChange={(e) => handleInputChange("difficulty", e.target.value)}
          >
            {Object.values(DIFFICULTY_LEVELS).map((level) => (
              <MenuItem key={level} value={level}>
                <Chip
                  label={level}
                  size="small"
                  sx={{
                    backgroundColor:
                      DIFFICULTY_COLORS[level]?.background ||
                      COLORS.secondary[100],
                    color:
                      DIFFICULTY_COLORS[level]?.color || COLORS.secondary[700],
                    border: `1px solid ${
                      DIFFICULTY_COLORS[level]?.border || COLORS.secondary[300]
                    }`,
                    fontWeight: 500,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Time Estimate (minutes)"
          type="number"
          value={formData.estimatedTime}
          onChange={(e) =>
            handleInputChange("estimatedTime", parseInt(e.target.value) || 0)
          }
          placeholder="30"
          inputProps={{ min: 0, max: 480 }}
        />
      </Grid>

      {/* Source Platform and URL */}
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

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Problem ID"
          value={formData.source.problemNumber}
          onChange={(e) => handleSourceChange("problemNumber", e.target.value)}
          placeholder="e.g., 1, 104, two-sum"
        />
      </Grid>

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
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
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
    </Grid>
  );

  const renderCodeSolutionsStep = () => (
    <Box>
      {/* Existing Solutions */}
      {formData.codeSolutions.length > 0 && (
        <Card
          sx={{
            mb: 3,
            border: `1px solid ${COLORS.secondary[200]}`,
            borderRadius: BORDER_RADIUS.xl,
            boxShadow: SHADOWS.card,
          }}
        >
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Code sx={{ color: COLORS.primary[600] }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: COLORS.primary[700] }}
                >
                  Saved Solutions ({formData.codeSolutions.length})
                </Typography>
              </Box>
            }
            subheader="Your previously saved code solutions"
            sx={{
              background: COLORS.gradient.card,
              borderBottom: `1px solid ${COLORS.secondary[200]}`,
            }}
          />
          <CardContent sx={{ pt: 2 }}>
            {formData.codeSolutions.map((solution, index) => (
              <Card
                key={solution.id}
                sx={{
                  mb: index === formData.codeSolutions.length - 1 ? 0 : 2,
                  border: `1px solid ${COLORS.secondary[200]}`,
                  borderRadius: BORDER_RADIUS.lg,
                  "&:hover": {
                    borderColor: COLORS.primary[300],
                    boxShadow: SHADOWS.sm,
                  },
                }}
              >
                <CardContent sx={{ pb: "16px !important" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: COLORS.primary[100],
                          color: COLORS.primary[700],
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {solution.language?.charAt(0) || "C"}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {solution.title}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={solution.language}
                            size="small"
                            sx={{
                              backgroundColor: COLORS.primary[100],
                              color: COLORS.primary[700],
                              fontWeight: 500,
                            }}
                          />
                          {solution.timeComplexity && (
                            <Chip
                              label={`Time: ${solution.timeComplexity}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: COLORS.success[300],
                                color: COLORS.success[700],
                              }}
                            />
                          )}
                          {solution.spaceComplexity && (
                            <Chip
                              label={`Space: ${solution.spaceComplexity}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: COLORS.warning[300],
                                color: COLORS.warning[700],
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit Solution">
                        <IconButton
                          size="small"
                          onClick={() => handleEditSolution(index)}
                          sx={{
                            color: COLORS.primary[600],
                            "&:hover": {
                              backgroundColor: COLORS.primary[100],
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Solution">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSolution(index)}
                          sx={{
                            color: COLORS.error[600],
                            "&:hover": {
                              backgroundColor: COLORS.error[100],
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {solution.approach && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        fontStyle: "italic",
                        borderLeft: `3px solid ${COLORS.primary[200]}`,
                        pl: 2,
                        backgroundColor: COLORS.primary[50],
                        py: 1,
                        borderRadius: BORDER_RADIUS.sm,
                      }}
                    >
                      💡 {solution.approach}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Code Editor */}
      <Card>
        <CardHeader
          title={
            editingSolutionIndex >= 0
              ? "Edit Code Solution"
              : "Add Code Solution"
          }
          action={
            editingSolutionIndex >= 0 && (
              <Button onClick={handleCancelEdit} startIcon={<Close />}>
                Cancel Edit
              </Button>
            )
          }
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Solution Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Solution Title"
                value={currentSolution.title}
                onChange={(e) => handleSolutionChange("title", e.target.value)}
                placeholder="e.g., Brute Force, Optimized DP, Two Pointers"
              />
            </Grid>

            {/* Programming Language */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Programming Language</InputLabel>
                <Select
                  value={currentSolution.language}
                  label="Programming Language"
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {Object.values(PROGRAMMING_LANGUAGES).map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Time and Space Complexity */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Complexity"
                value={currentSolution.timeComplexity}
                onChange={(e) =>
                  handleSolutionChange("timeComplexity", e.target.value)
                }
                placeholder="e.g., O(n), O(log n), O(n²)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Space Complexity"
                value={currentSolution.spaceComplexity}
                onChange={(e) =>
                  handleSolutionChange("spaceComplexity", e.target.value)
                }
                placeholder="e.g., O(1), O(n), O(log n)"
              />
            </Grid>

            {/* Approach Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Approach Description"
                value={currentSolution.approach}
                onChange={(e) =>
                  handleSolutionChange("approach", e.target.value)
                }
                placeholder="Briefly describe your approach and algorithm..."
              />
            </Grid>
          </Grid>

          {/* Code Editor */}
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ mt: 2, color: COLORS.primary[700], fontWeight: 600 }}
          >
            💻 Code Editor
          </Typography>
          <CodeEditor
            value={currentSolution.code}
            onChange={(value) => handleSolutionChange("code", value)}
            language={currentSolution.language?.toLowerCase()}
            placeholder={`Enter your ${currentSolution.language} solution here...`}
            minHeight="400px"
            maxHeight="600px"
            showHeader={true}
            fullWidth={true}
            autoResize={true}
            title={`${currentSolution.language} Solution - ${
              currentSolution.title || "Untitled"
            }`}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSaveSolution}
              startIcon={<Save />}
              disabled={
                !currentSolution.title.trim() || !currentSolution.code.trim()
              }
            >
              {editingSolutionIndex >= 0 ? "Update Solution" : "Save Solution"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderReviewStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Checkpoint
      </Typography>

      <Grid container spacing={3}>
        {/* Problem Details Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Problem Details" />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {formData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formData.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                <Chip
                  label={formData.difficulty}
                  color="primary"
                  size="small"
                />
                {formData.estimatedTime > 0 && (
                  <Chip label={`${formData.estimatedTime} min`} size="small" />
                )}
                {formData.source.platform && (
                  <Chip
                    label={formData.source.platform}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              {formData.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tags:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      mt: 0.5,
                      flexWrap: "wrap",
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
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Code Solutions Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Code Solutions"
              subheader={`${formData.codeSolutions.length} solution(s) added`}
            />
            <CardContent>
              {formData.codeSolutions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No code solutions added yet. You can add them later.
                </Typography>
              ) : (
                <List dense>
                  {formData.codeSolutions.map((solution, index) => (
                    <ListItem key={solution.id}>
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
                            <Typography variant="body2">
                              {solution.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          solution.timeComplexity || solution.spaceComplexity
                            ? `${solution.timeComplexity || "?"} time, ${
                                solution.spaceComplexity || "?"
                              } space`
                            : "No complexity analysis"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "85vh",
          maxHeight: "95vh",
          width: "95vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          background: COLORS.gradient.primary,
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Assignment sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Create New Checkpoint
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 1,
          display: "flex",
          flexDirection: "column",
          height: "70vh",
          overflow: "hidden",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stepper */}
        <Box
          sx={{
            background: COLORS.gradient.card,
            borderRadius: BORDER_RADIUS.xl,
            p: 3,
            mb: 4,
            border: `1px solid ${COLORS.secondary[200]}`,
          }}
        >
          <Stepper
            activeStep={activeStep}
            sx={{
              "& .MuiStepConnector-line": {
                borderColor: COLORS.secondary[300],
              },
            }}
          >
            {steps.map((step, index) => (
              <Step
                key={step.label}
                completed={completed[index]}
                sx={{ cursor: "pointer" }}
                onClick={() => handleStepClick(index)}
              >
                <StepLabel
                  optional={
                    step.optional && (
                      <Typography
                        variant="caption"
                        color={COLORS.secondary[500]}
                      >
                        Optional
                      </Typography>
                    )
                  }
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        bgcolor:
                          activeStep === index
                            ? COLORS.primary[600]
                            : completed[index]
                            ? COLORS.success[600]
                            : COLORS.secondary[300],
                        color: "white",
                        width: 36,
                        height: 36,
                        fontWeight: 600,
                        boxShadow: SHADOWS.sm,
                        border: `2px solid ${
                          activeStep === index
                            ? COLORS.primary[200]
                            : completed[index]
                            ? COLORS.success[200]
                            : "transparent"
                        }`,
                      }}
                    >
                      {step.icon}
                    </Avatar>
                  )}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: activeStep === index ? 600 : 500,
                      color:
                        activeStep === index
                          ? COLORS.primary[700]
                          : COLORS.secondary[600],
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            paddingBottom: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          background: COLORS.gradient.card,
          borderTop: `1px solid ${COLORS.secondary[200]}`,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          size="large"
          sx={{
            color: COLORS.secondary[600],
            "&:hover": {
              backgroundColor: COLORS.secondary[100],
            },
          }}
        >
          Cancel
        </Button>

        <Box sx={{ flex: "1 1 auto" }} />

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            disabled={loading}
            size="large"
            variant="outlined"
            sx={{
              borderColor: COLORS.primary[300],
              color: COLORS.primary[600],
              "&:hover": {
                borderColor: COLORS.primary[400],
                backgroundColor: COLORS.primary[50],
              },
            }}
          >
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            endIcon={<ArrowForward />}
            disabled={activeStep === 0 && !validateBasicInfo()}
            size="large"
            variant="contained"
            sx={{
              background: COLORS.gradient.primary,
              "&:hover": {
                background: COLORS.gradient.primaryHover,
              },
              "&:disabled": {
                background: COLORS.secondary[300],
                color: COLORS.secondary[500],
              },
              px: 3,
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Save />
              )
            }
            size="large"
            sx={{
              background: COLORS.gradient.success,
              "&:hover": {
                background: "linear-gradient(90deg, #047857 0%, #059669 100%)",
              },
              "&:disabled": {
                background: COLORS.secondary[300],
                color: COLORS.secondary[500],
              },
              px: 4,
              boxShadow: SHADOWS.md,
            }}
          >
            {loading ? "Creating..." : "Create Checkpoint"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointCreateModalEnhanced;
