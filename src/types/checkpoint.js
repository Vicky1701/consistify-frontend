/**
 * @typedef {Object} CodeSolution
 * @property {string} id - Unique identifier for the code solution
 * @property {string} title - Solution title (e.g., "Brute Force", "Optimized DP")
 * @property {string} language - Programming language
 * @property {string} code - The actual code
 * @property {string} timeComplexity - Time complexity (e.g., "O(n)")
 * @property {string} spaceComplexity - Space complexity (e.g., "O(1)")
 * @property {string} approach - Description of the approach
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} CheckpointSource
 * @property {string} platform - Source platform
 * @property {string} url - Problem URL
 * @property {string} problemNumber - Problem number (optional)
 */

/**
 * @typedef {Object} Checkpoint
 * @property {string} id - Unique identifier
 * @property {string} title - Problem title
 * @property {CheckpointSource} source - Source information
 * @property {string} difficulty - Problem difficulty
 * @property {string[]} tags - Array of tags
 * @property {CodeSolution[]} codes - Array of code solutions
 * @property {string} notes - User notes
 * @property {string} status - Problem solving status
 * @property {string} consistencyPathId - Associated consistency path
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} lastModified - Last modification timestamp
 */

// Constants
export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const PROBLEM_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REVIEW: "Review",
};

export const SOURCE_PLATFORMS = {
  LEETCODE: "LeetCode",
  GEEKSFORGEEKS: "GeeksforGeeks",
  CUSTOM: "Custom",
};

export const PROGRAMMING_LANGUAGES = {
  JAVA: "Java",
  PYTHON: "Python",
  CPP: "C++",
  JAVASCRIPT: "JavaScript",
};

export const COMMON_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Two Pointers",
  "Binary Search",
  "Tree",
  "Graph",
  "Sorting",
  "Greedy",
  "Stack",
  "Queue",
  "Linked List",
  "Math",
  "Bit Manipulation",
  "Sliding Window",
  "Recursion",
  "Backtracking",
  "Divide and Conquer",
];

// Default checkpoint structure
export const DEFAULT_CHECKPOINT = {
  title: "",
  description: "",
  source: {
    platform: SOURCE_PLATFORMS.LEETCODE,
    url: "",
    problemNumber: "",
  },
  difficulty: DIFFICULTY_LEVELS.EASY,
  tags: [],
  codeSolutions: [],
  notes: "",
  status: PROBLEM_STATUS.NOT_STARTED,
  consistencyPathId: "",
  estimatedTime: 30,
};

// Default code solution structure
export const DEFAULT_CODE_SOLUTION = {
  title: "",
  language: PROGRAMMING_LANGUAGES.JAVA,
  code: "",
  timeComplexity: "",
  spaceComplexity: "",
  approach: "",
};

// Code templates for different languages
export const CODE_TEMPLATES = {
  [PROGRAMMING_LANGUAGES.JAVA]: `public class Solution {
    public void solutionMethod() {
        // Your code here
    }
}`,
  [PROGRAMMING_LANGUAGES.PYTHON]: `def solution():
    # Your code here
    pass`,
  [PROGRAMMING_LANGUAGES.CPP]: `#include <iostream>
using namespace std;

class Solution {
public:
    void solutionMethod() {
        // Your code here
    }
};`,
  [PROGRAMMING_LANGUAGES.JAVASCRIPT]: `function solution() {
    // Your code here
}`,
};

// Validation rules
export const VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  sourceUrl: {
    required: false,
    pattern: /^https?:\/\/.+/,
  },
  tags: {
    maxCount: 10,
  },
  notes: {
    maxLength: 1000,
  },
  codeTitle: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  code: {
    required: true,
    minLength: 10,
  },
  approach: {
    maxLength: 500,
  },
};

// Export all constants and types
const CheckpointTypes = {
  DIFFICULTY_LEVELS,
  PROBLEM_STATUS,
  SOURCE_PLATFORMS,
  PROGRAMMING_LANGUAGES,
  COMMON_TAGS,
  DEFAULT_CHECKPOINT,
  DEFAULT_CODE_SOLUTION,
  CODE_TEMPLATES,
  VALIDATION_RULES,
};

export default CheckpointTypes;
