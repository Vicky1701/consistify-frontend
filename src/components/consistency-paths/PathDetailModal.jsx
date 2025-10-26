import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Fab,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Close,
  CheckCircle,
  Code,
  Link,
  Add,
  CalendarToday,
  TrackChanges,
  Repeat,
  Assignment,
} from "@mui/icons-material";
import { getCheckpoints } from "../../services/api";
import CheckpointCreateForm from "./CheckpointCreateForm";

const PathDetailModal = ({ open, path, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [isLoadingCheckpoints, setIsLoadingCheckpoints] = useState(false);
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false);
  const [error, setError] = useState("");

  const loadCheckpoints = useCallback(async () => {
    if (!path?.id) return;

    setIsLoadingCheckpoints(true);
    setError("");
    try {
      const response = await getCheckpoints(path.id);
      setCheckpoints(response.data || []);
    } catch (error) {
      setError("Failed to load checkpoints");
      console.error("Error loading checkpoints:", error);
    } finally {
      setIsLoadingCheckpoints(false);
    }
  }, [path?.id]);

  useEffect(() => {
    if (open && path) {
      loadCheckpoints();
    }
  }, [open, path, loadCheckpoints]); // Include loadCheckpoints in dependencies

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCheckpointAdded = (newCheckpoint) => {
    setCheckpoints((prev) => [...prev, newCheckpoint]);
    setShowAddCheckpoint(false);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (!path) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          {path.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="path detail tabs"
          >
            <Tab label="Overview" />
            <Tab label={`Checkpoints (${checkpoints.length})`} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Path Configuration
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                  <Chip
                    icon={<CalendarToday />}
                    label={`Duration: ${path.durationDays} days`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<TrackChanges />}
                    label={`Daily Target: ${path.dailyTarget} problems`}
                    variant="outlined"
                    color="secondary"
                  />
                  <Chip
                    icon={<Repeat />}
                    label={`Repetition Cycle: ${path.repetitionCycle} days`}
                    variant="outlined"
                    color="info"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(path.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {formatDate(path.updatedAt)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Progress Summary
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {checkpoints.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Checkpoints
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {Math.floor(checkpoints.length * 0.7)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {Math.ceil(checkpoints.length * 0.3)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Review
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3, position: "relative", minHeight: "400px" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {showAddCheckpoint ? (
              <CheckpointCreateForm
                pathId={path.id}
                onSuccess={handleCheckpointAdded}
                onCancel={() => setShowAddCheckpoint(false)}
                onError={(err) => setError(err)}
              />
            ) : (
              <>
                {isLoadingCheckpoints ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : checkpoints.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Assignment
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No checkpoints yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Start adding problems to track your progress on this
                      consistency path.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setShowAddCheckpoint(true)}
                      sx={{
                        background:
                          "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                        },
                      }}
                    >
                      Add First Checkpoint
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {checkpoints.map((checkpoint, index) => (
                      <ListItem
                        key={checkpoint.id || index}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          mb: 1,
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {checkpoint.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Source: {checkpoint.source}
                              </Typography>
                              {checkpoint.tags &&
                                checkpoint.tags.length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                      mt: 1,
                                    }}
                                  >
                                    {checkpoint.tags.map((tag, tagIndex) => (
                                      <Chip
                                        key={tagIndex}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                )}
                            </Box>
                          }
                        />
                        {checkpoint.code && (
                          <Tooltip title="View Code">
                            <IconButton size="small">
                              <Code />
                            </IconButton>
                          </Tooltip>
                        )}
                        {checkpoint.source !== "Custom" && (
                          <Tooltip title="Open Source">
                            <IconButton size="small">
                              <Link />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}

                {!showAddCheckpoint && checkpoints.length > 0 && (
                  <Fab
                    color="primary"
                    aria-label="add checkpoint"
                    onClick={() => setShowAddCheckpoint(true)}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      background:
                        "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
                      },
                    }}
                  >
                    <Add />
                  </Fab>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PathDetailModal;
