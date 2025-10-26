import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  MoreVert,
  CalendarToday,
  TrackChanges,
  Repeat,
  Timeline,
} from "@mui/icons-material";
import { deleteConsistencyPath } from "../../services/api";

const PathListItem = ({ path, onEdit, onDelete, onViewDetails }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteConsistencyPath(path.id);
      if (onDelete) {
        onDelete(path.id);
      }
    } catch (error) {
      console.error("Failed to delete path:", error);
      // You might want to show an error message to the user
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(path);
    }
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Calculate progress (this would be based on actual checkpoints in a real app)
  const mockProgress = Math.floor(Math.random() * 100); // This should come from actual data

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              fontWeight="bold"
              sx={{
                color: "#1976d2",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => onViewDetails && onViewDetails(path)}
            >
              {path.name}
            </Typography>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              icon={<CalendarToday />}
              label={`${path.durationDays} days`}
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              icon={<TrackChanges />}
              label={`${path.dailyTarget}/day`}
              size="small"
              variant="outlined"
              color="secondary"
            />
            <Chip
              icon={<Repeat />}
              label={`${path.repetitionCycle}d cycle`}
              size="small"
              variant="outlined"
              color="info"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={mockProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background:
                    "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justify: "space-between", mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(path.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {formatDate(path.updatedAt)}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => onViewDetails && onViewDetails(path)}
            startIcon={<Timeline />}
            sx={{
              background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
              },
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit Path
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete Path
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Consistency Path
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{path.name}"? This action cannot be
            undone and will also delete all associated checkpoints.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <LinearProgress size={20} /> : <Delete />}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PathListItem;
