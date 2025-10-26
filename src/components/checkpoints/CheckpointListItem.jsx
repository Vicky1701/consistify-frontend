import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Code,
  Link,
  Schedule,
  CheckCircle,
  RadioButtonUnchecked,
  Pending,
} from "@mui/icons-material";
import { DIFFICULTY_LEVELS, PROBLEM_STATUS } from "../../types/checkpoint";

const CheckpointListItem = ({ checkpoint, onDelete, onUpdate, onEdit }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    onEdit && onEdit(checkpoint);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete "${checkpoint.title}"?`)
    ) {
      onDelete && onDelete(checkpoint.id);
    }
    handleMenuClose();
  };

  const handleStatusToggle = () => {
    let newStatus;
    switch (checkpoint.status) {
      case PROBLEM_STATUS.NOT_STARTED:
        newStatus = PROBLEM_STATUS.IN_PROGRESS;
        break;
      case PROBLEM_STATUS.IN_PROGRESS:
        newStatus = PROBLEM_STATUS.COMPLETED;
        break;
      case PROBLEM_STATUS.COMPLETED:
        newStatus = PROBLEM_STATUS.NOT_STARTED;
        break;
      default:
        newStatus = PROBLEM_STATUS.NOT_STARTED;
    }

    onUpdate &&
      onUpdate({
        ...checkpoint,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return "success";
      case DIFFICULTY_LEVELS.MEDIUM:
        return "warning";
      case DIFFICULTY_LEVELS.HARD:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PROBLEM_STATUS.COMPLETED:
        return <CheckCircle color="success" />;
      case PROBLEM_STATUS.IN_PROGRESS:
        return <Pending color="warning" />;
      case PROBLEM_STATUS.NOT_STARTED:
        return <RadioButtonUnchecked color="disabled" />;
      default:
        return <RadioButtonUnchecked color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PROBLEM_STATUS.COMPLETED:
        return "success";
      case PROBLEM_STATUS.IN_PROGRESS:
        return "warning";
      case PROBLEM_STATUS.NOT_STARTED:
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressValue = () => {
    if (!checkpoint.codeSolutions || checkpoint.codeSolutions.length === 0) {
      return 0;
    }
    return Math.min((checkpoint.codeSolutions.length / 3) * 100, 100); // Assume 3 solutions is 100%
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        border:
          checkpoint.status === PROBLEM_STATUS.COMPLETED
            ? "2px solid #4caf50"
            : "1px solid #e0e0e0",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={`Click to toggle status`}>
              <IconButton
                size="small"
                onClick={handleStatusToggle}
                sx={{ p: 0.5 }}
              >
                {getStatusIcon(checkpoint.status)}
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                lineHeight: 1.2,
                textDecoration:
                  checkpoint.status === PROBLEM_STATUS.COMPLETED
                    ? "line-through"
                    : "none",
                opacity:
                  checkpoint.status === PROBLEM_STATUS.COMPLETED ? 0.7 : 1,
              }}
            >
              {checkpoint.title}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Difficulty and Status Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={checkpoint.difficulty}
            color={getDifficultyColor(checkpoint.difficulty)}
            size="small"
            variant="outlined"
          />
          <Chip
            label={checkpoint.status}
            color={getStatusColor(checkpoint.status)}
            size="small"
          />
          {checkpoint.source?.platform && (
            <Chip
              label={checkpoint.source.platform}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          )}
        </Box>

        {/* Problem Description */}
        {checkpoint.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
            }}
          >
            {checkpoint.description}
          </Typography>
        )}

        {/* Tags */}
        {checkpoint.tags && checkpoint.tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
            {checkpoint.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.65rem", height: "20px" }}
              />
            ))}
            {checkpoint.tags.length > 3 && (
              <Chip
                label={`+${checkpoint.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.65rem", height: "20px" }}
              />
            )}
          </Box>
        )}

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Solutions: {checkpoint.codeSolutions?.length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(getProgressValue())}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Source Link */}
        {checkpoint.source?.url && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Link sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography
              variant="caption"
              color="primary"
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": { color: "primary.dark" },
              }}
              onClick={() => window.open(checkpoint.source.url, "_blank")}
            >
              View Problem
            </Typography>
          </Box>
        )}

        {/* Date Info */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          <Schedule sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
          Created {formatDate(checkpoint.createdAt)}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit && onEdit(checkpoint)}
          sx={{ mr: "auto" }}
        >
          <Code />
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          {checkpoint.codeSolutions?.length || 0} solutions
        </Typography>
      </CardActions>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Checkpoint</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onEdit && onEdit(checkpoint)}>
          <ListItemIcon>
            <Code fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Solutions</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default CheckpointListItem;
