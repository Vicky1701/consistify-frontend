/**
 * Utility functions for consistency path management
 */

// Date formatting utilities
export const formatDate = (dateString) => {
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

export const formatDateTime = (dateString) => {
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

export const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return "Unknown";
  }
};

// Progress calculation utilities
export const calculateProgress = (checkpoints, totalTarget) => {
  if (!checkpoints || checkpoints.length === 0) return 0;
  return Math.min(100, Math.round((checkpoints.length / totalTarget) * 100));
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return "success";
  if (progress >= 50) return "warning";
  return "error";
};

export const getProgressMessage = (progress) => {
  if (progress >= 100) return "Completed! 🎉";
  if (progress >= 80) return "Almost there! 💪";
  if (progress >= 50) return "Good progress 👍";
  if (progress >= 25) return "Getting started 🚀";
  return "Just beginning 🌱";
};

// Form validation utilities
export const validateConsistencyPathForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = "Path name must be at least 3 characters long";
  }

  if (!formData.duration || formData.duration < 1 || formData.duration > 365) {
    errors.duration = "Duration must be between 1 and 365 days";
  }

  if (
    !formData.dailyTarget ||
    formData.dailyTarget < 1 ||
    formData.dailyTarget > 20
  ) {
    errors.dailyTarget = "Daily target must be between 1 and 20 problems";
  }

  if (
    !formData.repetitionCycle ||
    formData.repetitionCycle < 1 ||
    formData.repetitionCycle > 30
  ) {
    errors.repetitionCycle = "Repetition cycle must be between 1 and 30 days";
  }

  return errors;
};

export const validateCheckpointForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = "Problem title must be at least 3 characters long";
  }

  if (!formData.source || formData.source.trim().length < 2) {
    errors.source = "Source is required";
  }

  return errors;
};

// Data transformation utilities
export const transformPathForApi = (formData) => {
  return {
    name: formData.name.trim(),
    duration: Number(formData.duration),
    dailyTarget: Number(formData.dailyTarget),
    repetitionCycle: Number(formData.repetitionCycle),
  };
};

export const transformCheckpointForApi = (formData) => {
  return {
    title: formData.title.trim(),
    source: formData.source.trim(),
    tags: formData.tags || [],
    notes: formData.notes ? formData.notes.trim() : "",
    code: formData.code ? formData.code.trim() : "",
  };
};

// Search and filter utilities
export const filterPaths = (paths, searchTerm, filterBy) => {
  let filtered = [...paths];

  // Apply search filter
  if (searchTerm && searchTerm.trim()) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (path) =>
        path.name.toLowerCase().includes(search) ||
        (path.description && path.description.toLowerCase().includes(search))
    );
  }

  // Apply category filter
  if (filterBy && filterBy !== "all") {
    switch (filterBy) {
      case "short":
        filtered = filtered.filter((path) => path.durationDays <= 7);
        break;
      case "medium":
        filtered = filtered.filter(
          (path) => path.durationDays > 7 && path.durationDays <= 30
        );
        break;
      case "long":
        filtered = filtered.filter((path) => path.durationDays > 30);
        break;
      case "active":
        // You could add logic here to filter active paths
        break;
      case "completed":
        // You could add logic here to filter completed paths
        break;
      default:
        break;
    }
  }

  return filtered;
};

export const sortPaths = (paths, sortBy) => {
  return [...paths].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "duration":
        return a.durationDays - b.durationDays;
      case "target":
        return a.dailyTarget - b.dailyTarget;
      case "created":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "updated":
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return 0;
    }
  });
};

// Storage utilities for caching
export const getCachedPaths = () => {
  try {
    const cached = localStorage.getItem("consistify_paths");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export const setCachedPaths = (paths) => {
  try {
    localStorage.setItem("consistify_paths", JSON.stringify(paths));
  } catch {
    // Ignore storage errors
  }
};

export const clearCachedPaths = () => {
  try {
    localStorage.removeItem("consistify_paths");
  } catch {
    // Ignore storage errors
  }
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status === 404) {
    return "Resource not found";
  }

  if (error.response?.status === 500) {
    return "Server error. Please try again later.";
  }

  if (error.code === "NETWORK_ERROR") {
    return "Network error. Please check your connection.";
  }

  return error.message || "An unexpected error occurred";
};

// Animation utilities
export const createSpringConfig = (tension = 300, friction = 30) => {
  return { tension, friction };
};

export const getRandomDelay = (max = 100) => {
  return Math.random() * max;
};

// Color utilities
export const getTagColor = (tag) => {
  const colors = {
    Arrays: "#3b82f6",
    Strings: "#ef4444",
    "Dynamic Programming": "#8b5cf6",
    Graphs: "#10b981",
    Trees: "#f59e0b",
    "Binary Search": "#06b6d4",
    Sorting: "#84cc16",
    "Hash Tables": "#f97316",
    "Two Pointers": "#ec4899",
    "Sliding Window": "#6366f1",
    Greedy: "#14b8a6",
    Backtracking: "#a855f7",
    Recursion: "#22d3ee",
    Math: "#fbbf24",
    "Bit Manipulation": "#fb7185",
  };

  return colors[tag] || "#6b7280";
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: "#10b981",
    Medium: "#f59e0b",
    Hard: "#ef4444",
  };

  return colors[difficulty] || "#6b7280";
};

// Debug utilities
export const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Consistify Debug] ${message}`, data);
  }
};

export const perfTimer = (label) => {
  if (process.env.NODE_ENV === "development") {
    console.time(label);
    return () => console.timeEnd(label);
  }
  return () => {};
};
