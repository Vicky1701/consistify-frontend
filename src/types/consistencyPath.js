/**
 * ConsistencyPath structure definition
 * @typedef {Object} ConsistencyPath
 * @property {number} id - Unique identifier
 * @property {string} name - Path name (e.g., "7-Day Kickstart", "DSA Reboot")
 * @property {number} durationDays - Duration in days
 * @property {number} dailyTarget - Daily target (problems per day)
 * @property {number} repetitionCycle - Repetition cycle in days
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * ConsistencyPathRequest structure for API calls
 * @typedef {Object} ConsistencyPathRequest
 * @property {string} name - Path name
 * @property {number} duration - Duration in days
 * @property {number} dailyTarget - Daily target
 * @property {number} repetitionCycle - Repetition cycle in days
 */

/**
 * Checkpoint structure definition
 * @typedef {Object} Checkpoint
 * @property {number} id - Unique identifier
 * @property {string} title - Problem title
 * @property {string} source - Source (LeetCode, GFG, etc.)
 * @property {string[]} tags - Array of tags
 * @property {string} notes - Personal notes
 * @property {string} code - Code solution
 * @property {ConsistencyPath} path - Associated consistency path
 */

// Default values for new consistency path
export const DEFAULT_CONSISTENCY_PATH = {
  name: "",
  duration: 7,
  dailyTarget: 2,
  repetitionCycle: 2,
};

// Form validation rules
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  duration: {
    required: true,
    min: 1,
    max: 365,
  },
  dailyTarget: {
    required: true,
    min: 1,
    max: 20,
  },
  repetitionCycle: {
    required: true,
    min: 1,
    max: 30,
  },
};

// Suggested path names for inspiration
export const SUGGESTED_PATH_NAMES = [
  "7-Day Kickstart",
  "DSA Reboot",
  "30-Day Challenge",
  "Array Master",
  "Graph Explorer",
  "DP Destroyer",
  "Tree Traverser",
  "Sorting Specialist",
  "Binary Search Bootcamp",
  "String Manipulation Marathon",
];

// Common tags for checkpoints
export const COMMON_TAGS = [
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Trees",
  "Binary Search",
  "Sorting",
  "Hash Tables",
  "Two Pointers",
  "Sliding Window",
  "Greedy",
  "Backtracking",
  "Recursion",
  "Math",
  "Bit Manipulation",
];

// Sources for problems
export const PROBLEM_SOURCES = [
  "LeetCode",
  "GeeksforGeeks",
  "HackerRank",
  "CodeSignal",
  "InterviewBit",
  "Codeforces",
  "AtCoder",
  "Custom",
];
