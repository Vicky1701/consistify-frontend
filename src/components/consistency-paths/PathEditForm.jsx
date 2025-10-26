import React, { useState, useEffect } from "react";
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
import { updateConsistencyPath } from "../../services/api";
import {
  VALIDATION_RULES,
  SUGGESTED_PATH_NAMES,
} from "../../types/consistencyPath";

const PathEditForm = ({ path, onSuccess, onCancel, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    duration: 7,
    dailyTarget: 2,
    repetitionCycle: 2,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (path) {
      setFormData({
        name: path.name || "",
        duration: path.durationDays || 7,
        dailyTarget: path.dailyTarget || 2,
        repetitionCycle: path.repetitionCycle || 2,
      });
    }
  }, [path]);

  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return "";

    if (
      rules.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must be no more than ${rules.maxLength} characters`;
    }

    if (rules.min && Number(value) < rules.min) {
      return `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must be at least ${rules.min}`;
    }

    if (rules.max && Number(value) > rules.max) {
      return `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must be no more than ${rules.max}`;
    }

    return "";
  };

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

  const handleNameChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, name: newValue || "" }));

    if (errors.name) {
      const newErrors = { ...errors };
      delete newErrors.name;
      setErrors(newErrors);
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

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
        name: formData.name.trim(),
        duration: Number(formData.duration),
        dailyTarget: Number(formData.dailyTarget),
        repetitionCycle: Number(formData.repetitionCycle),
      };

      const response = await updateConsistencyPath(path.id, requestData);
      setSuccessMessage("Consistency Path updated successfully!");

      if (onSuccess) {
        setTimeout(() => onSuccess(response.data), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update consistency path";
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!path) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>No path selected for editing</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#1976d2", mb: 3 }}
      >
        Edit Consistency Path
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Autocomplete
          freeSolo
          options={SUGGESTED_PATH_NAMES}
          value={formData.name}
          onInputChange={handleNameChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Path Name"
              placeholder="e.g., 7-Day Kickstart, DSA Reboot"
              error={!!errors.name}
              helperText={
                errors.name || "Give your consistency path a memorable name"
              }
              required
              fullWidth
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
        />

        <TextField
          name="duration"
          label="Duration (Days)"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          error={!!errors.duration}
          helperText={
            errors.duration || "How many days will this consistency path last?"
          }
          required
          fullWidth
          inputProps={{ min: 1, max: 365 }}
        />

        <TextField
          name="dailyTarget"
          label="Daily Target (Problems/Day)"
          type="number"
          value={formData.dailyTarget}
          onChange={handleChange}
          error={!!errors.dailyTarget}
          helperText={
            errors.dailyTarget ||
            "How many problems do you want to solve daily?"
          }
          required
          fullWidth
          inputProps={{ min: 1, max: 20 }}
        />

        <TextField
          name="repetitionCycle"
          label="Repetition Cycle (Days)"
          type="number"
          value={formData.repetitionCycle}
          onChange={handleChange}
          error={!!errors.repetitionCycle}
          helperText={
            errors.repetitionCycle ||
            "After how many days should problems be repeated?"
          }
          required
          fullWidth
          inputProps={{ min: 1, max: 30 }}
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
            {isLoading ? "Updating..." : "Update Path"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PathEditForm;
