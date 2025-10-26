import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Close,
  CalendarToday,
  TrackChanges,
  Repeat,
} from "@mui/icons-material";

const PathDetailModal = ({ open, path, onClose }) => {
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
        sx: { minHeight: "400px" },
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

      <DialogContent sx={{ p: 3 }}>
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
              How to Add Checkpoints
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              To add problems to this consistency path:
            </Typography>
            <Box component="ol" sx={{ pl: 2, color: "text.secondary" }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Navigate to the <strong>Checkpoints</strong> section from the
                sidebar
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Click <strong>Add New Checkpoint</strong>
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Select <strong>"{path.name}"</strong> as your consistency path
              </Typography>
              <Typography component="li" variant="body2">
                Fill in your problem details and code solution
              </Typography>
            </Box>
          </CardContent>
        </Card>
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
