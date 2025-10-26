import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { addCheckpoint } from "../../services/api";
import { COMMON_TAGS, PROBLEM_SOURCES } from "../../types/consistencyPath";

const CheckpointCreateForm = ({ pathId, onSuccess, onCancel, onError }) => {
  const [formData, setFormData] = useState({
    title: "",
    source: "",
    tags: [],
    notes: "",
    code: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleTagsChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, tags: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Problem title is required";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        title: formData.title.trim(),
        source: formData.source.trim(),
        tags: formData.tags,
        notes: formData.notes.trim(),
        code: formData.code.trim(),
      };

      const response = await addCheckpoint(pathId, requestData);
      setSuccessMessage("Checkpoint added successfully!");

      // Reset form
      setFormData({
        title: "",
        source: "",
        tags: [],
        notes: "",
        code: "",
      });
      setErrors({});

      if (onSuccess) {
        setTimeout(() => onSuccess(response.data), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add checkpoint";
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#1976d2", mb: 3 }}
      >
        Add New Checkpoint
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          name="title"
          label="Problem Title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title || "Enter the name of the problem"}
          required
          fullWidth
          placeholder="e.g., Two Sum, Binary Tree Inorder Traversal"
        />

        <Autocomplete
          freeSolo
          options={PROBLEM_SOURCES}
          value={formData.source}
          onInputChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, source: newValue || "" }));
            if (errors.source) {
              const newErrors = { ...errors };
              delete newErrors.source;
              setErrors(newErrors);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Source"
              placeholder="e.g., LeetCode, GeeksforGeeks"
              error={!!errors.source}
              helperText={errors.source || "Where did you solve this problem?"}
              required
            />
          )}
        />

        <Autocomplete
          multiple
          options={COMMON_TAGS}
          value={formData.tags}
          onChange={handleTagsChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              placeholder="Select or type tags"
              helperText="Choose relevant tags for this problem"
            />
          )}
        />

        <TextField
          name="notes"
          label="Personal Notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Add your thoughts, approach, or key insights about this problem..."
          helperText="Optional: Add notes about your solution approach or key learnings"
          fullWidth
        />

        <TextField
          name="code"
          label="Solution Code"
          value={formData.code}
          onChange={handleChange}
          multiline
          rows={8}
          placeholder="// Paste your solution code here
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
    }
}"
          helperText="Optional: Save your solution code for future reference"
          fullWidth
          sx={{
            "& .MuiInputBase-input": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
            },
          }}
        />

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            startIcon={<Cancel />}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
            disabled={isLoading}
            sx={{
              background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
              },
            }}
          >
            {isLoading ? "Adding..." : "Add Checkpoint"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckpointCreateForm;
